import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions as A } from './slice'

export default ({ coreSagas }) => {
  const walletConnectSagas = sagas({ coreSagas })

  return function* walletConnectSaga() {
    // @ts-ignore
    yield takeLatest(A.handleSessionCallRequest.type, walletConnectSagas.handleSessionCallRequest)
    // @ts-ignore
    yield takeLatest(A.handleSessionDisconnect.type, walletConnectSagas.handleSessionDisconnect)
    // @ts-ignore
    yield takeLatest(A.handleSessionRequest.type, walletConnectSagas.handleSessionRequest)
    // @ts-ignore
    yield takeLatest(A.initWalletConnect.type, walletConnectSagas.initWalletConnect)
    // @ts-ignore
    yield takeLatest(A.respondToSessionRequest.type, walletConnectSagas.respondToSessionRequest)
    // @ts-ignore
    yield takeLatest(A.respondToTxSendRequest.type, walletConnectSagas.respondToTxSendRequest)
  }
}
