import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const authSagas = sagas({ api, coreSagas, networks })

  return function* authSaga() {
    yield takeLatest(actions.login.type, authSagas.login)
    yield takeLatest(actions.mobileLogin.type, authSagas.mobileLogin)
    yield takeLatest(actions.register.type, authSagas.register)
    yield takeLatest(actions.resetAccount.type, authSagas.resetAccount)
    yield takeLatest(actions.restore.type, authSagas.restore)
    yield takeLatest(actions.resendSmsCode.type, authSagas.resendSmsLoginCode)
    yield takeLatest(actions.restoreFromMetadata.type, authSagas.restoreFromMetadata)
    yield takeLatest(actions.initializeLogin.type, authSagas.initializeLogin)
    yield takeLatest(actions.triggerWalletMagicLink.type, authSagas.triggerWalletMagicLink)
    yield takeLatest(actions.getUserGeoLocation.type, authSagas.getUserGeoLocation)
    yield takeLatest(actions.pingManifestFile.type, authSagas.pingManifestFile)
  }
}
