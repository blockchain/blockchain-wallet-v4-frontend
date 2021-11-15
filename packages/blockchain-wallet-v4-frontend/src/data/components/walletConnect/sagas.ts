import WalletConnect from '@walletconnect/client'
import { eventChannel } from 'redux-saga'
import { call, cancel, cancelled, fork, put, select, take } from 'redux-saga/effects'

import { coreSelectors } from 'blockchain-wallet-v4/src'
import { RequestMethodType, WalletConnectStep } from 'data/components/walletConnect/types'

import { actions as A } from './slice'

export default ({ coreSagas }) => {
  let rpc

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
    // connection has ended
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
        // eslint-disable-next-line no-console
        console.log('RPC: session_request]:', data, error)
        emit(A.handleSessionRequest({ data, error }))
      })

      // subscribe to call requests
      rpc.on('call_request', (error, data) => {
        // eslint-disable-next-line no-console
        console.log('[RPC: call_request]: ', data, error)
        emit(A.handleSessionCallRequest({ data, error }))
      })

      // subscribe to disconnects
      rpc.on('disconnect', (error, data) => {
        // eslint-disable-next-line no-console
        console.log('RPC: disconnect]:', data, error)
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
      // init rpc
      rpc = new WalletConnect({
        clientMeta: {
          description: 'Blockchain.com Wallet',
          icons: [''], // TODO
          name: 'Blockchain.com Wallet',
          url: 'https://login.blockchain.com'
        },
        uri
      })
      // eslint-disable-next-line no-console
      console.log('[RPC Initialized]: ', rpc)

      // start listeners for rpc messages
      channel = yield call(createRpcListenerChannels)

      // TODO:WC: Move this somewhere
      localStorage.setItem('walletConnectUri', uri)

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

  const initWalletConnect = function* ({ payload }: ReturnType<typeof A.initWalletConnect>) {
    const rpcTask = yield fork(startRpcConnection, { uri: payload })

    // listen for user requested disconnect
    yield take(A.handleSessionDisconnect.type)
    yield cancel(rpcTask)
  }

  const respondToSessionRequest = function* ({
    payload
  }: ReturnType<typeof A.respondToSessionRequest>) {
    try {
      yield put(A.setStep({ name: WalletConnectStep.LOADING }))
      // eslint-disable-next-line no-console
      console.log('[Response to Session Request]: ', payload)

      if (payload.action === 'APPROVE') {
        // TODO:WC: move this to better place
        localStorage.setItem('walletConnectSession', JSON.stringify(payload.sessionDetails))

        // store dapp details on state
        yield put(A.setSessionDetails(payload.sessionDetails))

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
    respondToSessionRequest,
    respondToTxSendRequest
  }
}
