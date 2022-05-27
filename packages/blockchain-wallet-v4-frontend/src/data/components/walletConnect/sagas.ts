/* eslint-disable no-console */
// TODO: remove console logs
import WalletConnect from '@walletconnect/client'
import { eventChannel } from 'redux-saga'
import { call, cancel, cancelled, delay, fork, put, select, take } from 'redux-saga/effects'

import { coreSelectors } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import {
  AddNewDappFormType,
  InitWalletConnectPayload,
  RequestMethodType,
  WalletConnectStep
} from 'data/components/walletConnect/types'
import { ModalName } from 'data/modals/types'

import { BC_CLIENT_METADATA, WC_ADD_DAPP_FORM } from './model'
import * as S from './selectors'
import { actions as A } from './slice'

const logError = (e) => {
  console.error('WC Error: ', e)
}

export default ({ coreSagas }) => {
  let rpc: WalletConnect
  let dappsList: Array<WalletConnect>

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
        console.log('got session request', data, error)
        emit(A.handleSessionRequest({ data, error }))
      })

      // subscribe to call requests
      rpc.on('call_request', (error, data) => {
        console.log('got call request', data, error)
        emit(A.handleSessionCallRequest({ data, error }))
      })

      // subscribe to disconnects
      rpc.on('disconnect', (error, data) => {
        console.log('got disconnect request', data, error)
        // TODO: remove from localStorage?
        emit(A.handleSessionDisconnect({ data, error }))
      })

      return () => {
        // rpc.killSession()
      }
    })
  }

  const startRpcConnection = function* ({ sessionDetails, uri }: InitWalletConnectPayload) {
    let channel
    try {
      console.log('before create walletConnect', sessionDetails, uri)

      if (sessionDetails) {
        console.log('session details found, reusing old walletConnect')
        console.log('uri: ', uri)
        console.log('sessionDetails:', sessionDetails)
        console.log('dappsList', JSON.stringify(dappsList))

        const foundRpc = dappsList.find(
          (dapp) => JSON.stringify(dapp.session) === JSON.stringify(sessionDetails)
        )

        if (foundRpc) {
          // eslint-disable-next-line no-console
          console.log('found rpc in dapps list:', foundRpc)
          rpc = foundRpc
        } else {
          throw new Error('RPC not found in localStorage')
        }
      } else {
        console.log('no session details, creating new object')
        console.log('uri: ', uri)

        const newRpc = new WalletConnect({
          clientMeta: BC_CLIENT_METADATA,
          storageId: uri,
          uri
        })
        dappsList.push(newRpc)
        rpc = newRpc
      }

      console.log('after walletConnect created', rpc, rpc.session, sessionDetails, uri)

      // start listeners for rpc messages
      channel = yield call(createRpcListenerChannels)
      console.log('got the channel', channel)

      while (true) {
        console.log('while loop true')
        // message from rpc, forward action
        const action = yield take(channel)
        console.log('action', action)
        yield put(action)
      }
    } catch (e) {
      logError(e)
    } finally {
      if (yield cancelled()) {
        channel.close()
        // rpc.killSession()
      }
    }
  }

  const launchDappConnection = function* ({ payload }: ReturnType<typeof A.launchDappConnection>) {
    try {
      console.log('launching dapp: ', payload)
      const { sessionDetails, uri } = payload
      yield put(A.setSessionDetails(sessionDetails))
      yield put(A.initWalletConnect({ sessionDetails, uri }))
      yield put(
        actions.modals.showModal({
          props: { origin: 'WalletConnect' },
          type: ModalName.WALLET_CONNECT_MODAL
        })
      )
      yield put(A.setStep({ name: WalletConnectStep.SESSION_DASHBOARD }))
    } catch (e) {
      logError(e)
    }
  }

  const removeDappConnection = function ({ payload }: ReturnType<typeof A.removeDappConnection>) {
    try {
      const { sessionDetails, uri } = payload
      console.log('remove rpc data: ', sessionDetails, uri)
      // if rpc connection exists and it matches the dapp to be removed
      if (
        rpc &&
        sessionDetails &&
        JSON.stringify(sessionDetails.peerMeta) === JSON.stringify(rpc.peerMeta)
      ) {
        // kill session and notify dapp of disconnect
        rpc.killSession()
      } else {
        const removeRpc = new WalletConnect({
          clientMeta: BC_CLIENT_METADATA,
          session: sessionDetails,
          storageId: uri
        })
        removeRpc.killSession()
      }
    } catch (e) {
      logError(e)
    }
  }

  const initWalletConnect = function* ({ payload }: ReturnType<typeof A.initWalletConnect>) {
    try {
      const { sessionDetails, uri } = payload
      // start rpc connection and listeners
      const rpcTask = yield fork(startRpcConnection, { sessionDetails, uri })
      // wait for a disconnect event
      yield take(A.handleSessionDisconnect.type)
      // disconnect received, kill rpc
      yield cancel(rpcTask)
    } catch (e) {
      logError(e)
    }
  }

  const initLSWalletConnects = function* () {
    const dappsListObj = yield select(S.getAuthorizedDappsList)
    dappsList = dappsListObj.map((dapp) => {
      return new WalletConnect({
        clientMeta: BC_CLIENT_METADATA,
        session: dapp.sessionDetails,
        storageId: dapp.uri
      })
    })
  }

  const respondToSessionRequest = function* ({
    payload
  }: ReturnType<typeof A.respondToSessionRequest>) {
    const { action, sessionDetails, uri } = payload

    try {
      yield put(A.setStep({ name: WalletConnectStep.LOADING }))

      if (action === 'APPROVE') {
        // store dapp connection in local storage
        yield put(A.setSessionDetails(sessionDetails))

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
      logError(e)
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
      logError(e)
    }
  }

  const addNewDappConnection = function* () {
    console.log('adding new dapp connection...')
    try {
      yield put(A.setStep({ name: WalletConnectStep.LOADING }))
      const { newConnectionString } = selectors.form.getFormValues(WC_ADD_DAPP_FORM)(
        yield select()
      ) as AddNewDappFormType
      yield put(A.initWalletConnect({ uri: newConnectionString }))
    } catch (e) {
      logError(e)
    }
  }

  const showAddNewDapp = function* () {
    try {
      yield put(A.setStep({ name: WalletConnectStep.LOADING }))
      yield put(
        actions.modals.showModal({
          props: { origin: 'WalletConnect' },
          type: ModalName.WALLET_CONNECT_MODAL
        })
      )
      // without this delay, the flyout jarringly jumps around 🤷
      yield delay(1000)
      yield put(A.setStep({ name: WalletConnectStep.ADD_NEW_CONNECTION }))
    } catch (e) {
      logError(e)
    }
  }

  return {
    addNewDappConnection,
    handleSessionCallRequest,
    handleSessionDisconnect,
    handleSessionRequest,
    initLSWalletConnects,
    initWalletConnect,
    launchDappConnection,
    removeDappConnection,
    respondToSessionRequest,
    respondToTxSendRequest,
    showAddNewDapp
  }
}
