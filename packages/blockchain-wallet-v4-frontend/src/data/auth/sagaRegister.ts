import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const authSagas = sagas({ api, coreSagas, networks })

  return function* authSaga() {
    yield takeLatest(AT.DEAUTHORIZE_BROWSER, authSagas.deauthorizeBrowser)
    yield takeLatest(AT.LOGIN, authSagas.login)
    yield takeLatest(AT.LOGOUT, authSagas.logout)
    yield takeLatest(AT.LOGOUT_CLEAR_REDUX_STORE, authSagas.logoutClearReduxStore)
    yield takeLatest(AT.MOBILE_LOGIN, authSagas.mobileLogin)
    yield takeLatest(AT.REGISTER, authSagas.register)
    yield takeLatest(AT.RESET_ACCOUNT, authSagas.resetAccount)
    yield takeLatest(AT.RESTORE, authSagas.restore)
    yield takeLatest(AT.RESEND_SMS_CODE, authSagas.resendSmsLoginCode)
    yield takeLatest(AT.RESTORE_FROM_METADATA, authSagas.restoreFromMetadata)
    yield takeLatest(AT.UPGRADE_WALLET, authSagas.upgradeWallet)
    yield takeLatest(AT.INITIALIZE_LOGIN, authSagas.initializeLogin)
    yield takeLatest(AT.TRIGGER_WALLET_MAGIC_LINK, authSagas.triggerWalletMagicLink)
    yield takeLatest(AT.GET_USER_GEO_LOCATION, authSagas.getUserGeoLocation)
  }
}
