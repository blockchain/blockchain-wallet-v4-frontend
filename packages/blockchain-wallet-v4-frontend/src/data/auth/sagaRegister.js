import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const authSagas = sagas({ api, coreSagas })

  return function* authSaga () {
    yield takeLatest(AT.DEAUTHORIZE_BROWSER, authSagas.deauthorizeBrowser)
    yield takeLatest(AT.LOGIN, authSagas.login)
    yield takeLatest(AT.LOGOUT, authSagas.logout)
    yield takeLatest(
      AT.LOGOUT_CLEAR_REDUX_STORE,
      authSagas.logoutClearReduxStore
    )
    yield takeLatest(AT.MOBILE_LOGIN, authSagas.mobileLogin)
    yield takeLatest(AT.REGISTER, authSagas.register)
    yield takeLatest(AT.RESTORE, authSagas.restore)
    yield takeLatest(AT.REMIND_GUID, authSagas.remindGuid)
    yield takeLatest(AT.RESET_2FA, authSagas.reset2fa)
    yield takeLatest(AT.UPGRADE_WALLET, authSagas.upgradeWallet)
    yield takeLatest(AT.RESEND_SMS_CODE, authSagas.resendSmsLoginCode)
  }
}
