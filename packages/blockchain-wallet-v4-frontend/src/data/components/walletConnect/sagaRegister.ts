import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions as A } from './slice'

export default ({ coreSagas }) => {
  const walletConnectSagas = sagas({ coreSagas })

  return function* walletConnectSaga() {
    yield takeLatest(A.handleSessionCallRequest.type, walletConnectSagas.handleSessionCallRequest)
    yield takeLatest(A.handleSessionDisconnect.type, walletConnectSagas.handleSessionDisconnect)
    yield takeLatest(A.handleSessionRequest.type, walletConnectSagas.handleSessionRequest)
    yield takeLatest(A.initWalletConnect.type, walletConnectSagas.initWalletConnect)
    yield takeLatest(A.launchDappConnection.type, walletConnectSagas.launchDappConnection)
    yield takeLatest(A.removeDappConnection.type, walletConnectSagas.removeDappConnection)
    yield takeLatest(A.respondToSessionRequest.type, walletConnectSagas.respondToSessionRequest)
    yield takeLatest(A.respondToTxSendRequest.type, walletConnectSagas.respondToTxSendRequest)
  }
}
