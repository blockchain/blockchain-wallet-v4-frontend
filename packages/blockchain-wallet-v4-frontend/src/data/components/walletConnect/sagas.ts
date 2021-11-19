import WalletConnect from '@walletconnect/client'
import { eventChannel } from 'redux-saga'
import { call, cancel, cancelled, fork, put, select, take } from 'redux-saga/effects'

import { coreSelectors } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { RequestMethodType, WalletConnectStep } from 'data/components/walletConnect/types'
import { ModalName } from 'data/modals/types'

import { BC_CLIENT_METADATA, WC_STORAGE_KEY } from './model'
import * as S from './selectors'
import { actions as A } from './slice'

export default ({ coreSagas }) => {
  let rpc

  // adds a new dapp connection to local storage
  const addDappToLocalStorage = function* ({ sessionDetails, uri }) {
    // get existing dapp connections
    const dappList = yield select(S.getAuthorizedDappsList)
    // check if dapp was already stored
    const matchIndex = dappList.findIndex(
      (dapp) => dapp.sessionDetails.peerId === sessionDetails.peerId
    )

    if (matchIndex !== -1) {
      // update exist dapp if match found
      dappList[matchIndex] = { sessionDetails, uri }
    } else {
      // push new dapp to list
      dappList.push({ sessionDetails, uri })
    }

    // write list back to local storage
    localStorage.setItem(WC_STORAGE_KEY, JSON.stringify(dappList))
  }

  // removes a previously stored dapp from local storage
  const removeDappFromLocalStorage = function* ({ sessionDetails }) {
    // get existing dapp connections
    const dappList = yield select(S.getAuthorizedDappsList)
    // remove desired dapp and restore
    localStorage.setItem(
      WC_STORAGE_KEY,
      JSON.stringify(
        dappList.filter((dapp) => dapp.sessionDetails.peerId !== sessionDetails.peerId)
      )
    )
  }

  // session call request from dapp
  const handleSessionCallRequest = function* ({
    payload
  }: ReturnType<typeof A.handleSessionCallRequest>) {
    switch (true) {
      case payload.data.method === RequestMethodType.ETH_SEND_TX:
        return yield put(
          A.setStep({
            data: payload.data,
            error: payload.error,
            name: WalletConnectStep.APPROVE_TRANSACTION
          })
        )
      default:
        break
    }
  }

  // session failed, ended by dapp or rejected by user
  const handleSessionDisconnect = function* ({
    payload
  }: ReturnType<typeof A.handleSessionDisconnect>) {
    yield put(
      A.setStep({
        data: payload.data,
        error: payload.error,
        name: WalletConnectStep.DISCONNECTION_NOTICE
      })
    )
  }

  // session request from dapp
  const handleSessionRequest = function* ({ payload }: ReturnType<typeof A.handleSessionRequest>) {
    // show user session accept/reject screen
    yield put(
      A.setStep({
        data: payload.data.params[0],
        error: payload.error,
        name: WalletConnectStep.AUTHORIZE_CONNECTION
      })
    )
  }

  const createRpcListenerChannels = function () {
    return eventChannel((emit) => {
      // subscribe to session requests
      rpc.on('session_request', (error, data) => {
        emit(A.handleSessionRequest({ data, error }))
      })

      // subscribe to call requests
      rpc.on('call_request', (error, data) => {
        emit(A.handleSessionCallRequest({ data, error }))
      })

      // subscribe to disconnects
      rpc.on('disconnect', (error, data) => {
        // TODO: remove from localStorage?
        emit(A.handleSessionDisconnect({ data, error }))
      })

      return () => {
        rpc.killSession()
      }
    })
  }

  const startRpcConnection = function* ({ uri }: { uri: string }) {
    let channel

    try {
      // TODO: evaluate the need for this HACK!?
      localStorage.setItem('walletconnect', '')

      // init rpc
      rpc = new WalletConnect({
        clientMeta: BC_CLIENT_METADATA,
        uri
      })

      // start listeners for rpc messages
      channel = yield call(createRpcListenerChannels)

      while (true) {
        // message from rpc, forward action
        const action = yield take(channel)
        yield put(action)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('[RPC Error]: ', e)
    } finally {
      if (yield cancelled()) {
        channel.close()
        rpc.killSession()
      }
    }
  }

  const launchDappConnection = function* ({ payload }: ReturnType<typeof A.launchDappConnection>) {
    if (rpc) {
      yield put(A.setSessionDetails(payload.sessionDetails))
      yield put(A.setStep({ name: WalletConnectStep.SESSION_DASHBOARD }))
      yield put(
        actions.modals.showModal(ModalName.WALLET_CONNECT_MODAL, { origin: 'WalletConnect' })
      )
    } else {
      yield put(A.setSessionDetails(payload.sessionDetails))
      yield put(A.setStep({ name: WalletConnectStep.SESSION_DASHBOARD }))
      yield put(
        actions.modals.showModal(ModalName.WALLET_CONNECT_MODAL, { origin: 'WalletConnect' })
      )
      yield put(A.initWalletConnect(payload.uri))
    }
  }

  const removeDappConnection = function* ({ payload }: ReturnType<typeof A.removeDappConnection>) {
    const { sessionDetails } = payload
    // if rpc connection exists and it matches the dapp to be removed
    if (rpc && sessionDetails.peerId === rpc.peerId) {
      // kill session and notify dapp of disconnect
      rpc.killSession()
      // reset internal rpc to null
      rpc = null
    }
    // remove from local storage
    yield call(removeDappFromLocalStorage, { sessionDetails })
  }

  const initWalletConnect = function* ({ payload: uri }: ReturnType<typeof A.initWalletConnect>) {
    // start rpc connection and listeners
    const rpcTask = yield fork(startRpcConnection, { uri })
    // wait for a disconnect event
    yield take(A.handleSessionDisconnect.type)
    // disconnect received, kill rpc
    yield cancel(rpcTask)
  }

  const respondToSessionRequest = function* ({
    payload
  }: ReturnType<typeof A.respondToSessionRequest>) {
    const { action, sessionDetails, uri } = payload

    try {
      yield put(A.setStep({ name: WalletConnectStep.LOADING }))

      if (action === 'APPROVE') {
        // store dapp details on state
        yield put(A.setSessionDetails(sessionDetails))
        // store dapp connection in local storage
        yield call(addDappToLocalStorage, { sessionDetails, uri })

        const ethAccount = (yield select(coreSelectors.kvStore.eth.getContext)).getOrFail(
          'Failed to extract ETH account.'
        )
        rpc.approveSession({
          accounts: [ethAccount],
          chainId: 1 // ETH mainnet
        })

        // connection made, show user wallet connect dashboard
        yield put(
          A.setStep({
            name: WalletConnectStep.SESSION_DASHBOARD
          })
        )
      } else {
        // user rejected session, state update handled by handleSessionDisconnect
        rpc.rejectSession({ message: 'Connection rejected by user.' })
      }
    } catch (e) {
      // TODO
    }
  }

  const respondToTxSendRequest = function* ({
    payload
  }: ReturnType<typeof A.respondToTxSendRequest>) {
    try {
      yield put(A.setStep({ name: WalletConnectStep.LOADING }))

      if (payload.action === 'APPROVE') {
        // TODO
      } else {
        // user rejected transaction
        rpc.rejectRequest({
          error: { message: 'Transaction rejected by user.' },
          id: payload.requestDetails.id
        })

        yield put(
          A.setStep({
            name: WalletConnectStep.SESSION_DASHBOARD
          })
        )
      }
    } catch (e) {
      // TODO
    }
  }

  return {
    handleSessionCallRequest,
    handleSessionDisconnect,
    handleSessionRequest,
    initWalletConnect,
    launchDappConnection,
    removeDappConnection,
    respondToSessionRequest,
    respondToTxSendRequest
  }
}
