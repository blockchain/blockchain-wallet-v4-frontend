import WalletConnect from '@walletconnect/client'
import { eventChannel } from 'redux-saga'
import { call, cancel, cancelled, fork, put, select, take, takeLatest } from 'redux-saga/effects'

import { coreSelectors } from 'blockchain-wallet-v4/src'
import Remote from 'blockchain-wallet-v4/src/remote'
import {
  RequestMethodType,
  WalletConnectPayload,
  WalletConnectStep
} from 'data/components/walletConnect/types'

import { actions as A } from './slice'

export default ({ coreSagas }) => {
  let rpc

  // session call request from dapp
  const handleSessionCallRequest = function* (action: ReturnType<typeof A.setStep>) {
    const payload = action.payload as WalletConnectPayload

    switch (true) {
      case payload.data.method === RequestMethodType.ETH_SEND_TX:
        return yield put(
          A.setStep({
            data: payload.data,
            error: payload.error,
            name: WalletConnectStep.APPROVE_TRANSACTION_STEP
          })
        )
      default:
        break
    }
  }

  // session failed, ended by dapp or rejected by user
  const handleSessionDisconnect = function* (action: ReturnType<typeof A.setStep>) {
    const payload = action.payload as WalletConnectPayload
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
  const handleSessionRequest = function* (action: ReturnType<typeof A.setStep>) {
    const payload = action.payload as WalletConnectPayload
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
          icons: ['https://walletconnect.org/walletconnect-logo.png'], // TODO
          name: 'Blockchain.com Wallet',
          url: 'https://login.blockchain.com'
        },
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
      console.log('rpc error', e)
    } finally {
      if (yield cancelled()) {
        channel.close()
        rpc.killSession()
      }
    }
  }

  const initWalletConnect = function* (action: ReturnType<typeof A.initWalletConnect>) {
    const rpcTask = yield fork(startRpcConnection, { uri: action.payload })

    // listen for user requested disconnect
    yield take(A.handleSessionDisconnect.type)
    yield cancel(rpcTask)
  }

  const respondToSessionRequest = function* (action: ReturnType<typeof A.setStep>) {
    const payload = action.payload as WalletConnectPayload

    try {
      yield put(A.setStep(Remote.Loading))
      if (payload.name === 'APPROVE_TRANSACTION_STEP') {
        // store dapp details on state
        yield put(A.setSessionDetails(payload.data.sessionDetails))

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

  const respondToTxSendRequest = function* (action: ReturnType<typeof A.setStep>) {
    const payload = action.payload as WalletConnectPayload

    try {
      yield put(A.setStep(Remote.Loading))
      if (payload.name === 'APPROVE_TRANSACTION_STEP') {
        // TODO
      } else {
        // user rejected transaction
        rpc.rejectRequest({
          error: { message: 'Transaction rejected by user.' },
          id: payload.data.requestDetails.id
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
