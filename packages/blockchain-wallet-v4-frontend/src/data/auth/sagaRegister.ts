import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const authSagas = sagas({ api, coreSagas, networks })

  return function* authSaga() {
    yield takeLatest(actions.authorizeVerifyDevice.type, authSagas.authorizeVerifyDevice)
    yield takeLatest(actions.login.type, authSagas.login)
    yield takeLatest(actions.mobileLogin.type, authSagas.mobileLogin)
    yield takeLatest(actions.resendSmsCode.type, authSagas.resendSmsLoginCode)
    yield takeLatest(actions.initializeLogin.type, authSagas.initializeLogin)
    yield takeLatest(actions.triggerWalletMagicLink.type, authSagas.triggerWalletMagicLink)
    yield takeLatest(actions.exchangeLogin.type, authSagas.exchangeLogin)
    yield takeLatest(actions.exchangeResetPassword.type, authSagas.exchangeResetPassword)
    yield takeLatest(actions.continueLoginProcess, authSagas.continueLoginProcess)
    yield takeLatest(actions.mergeAccounts.type, authSagas.mergeAccounts)
    yield takeLatest(actions.mergeChangePassword.type, authSagas.mergeChangePassword)
    yield takeLatest(
      actions.secondAuthenticationForMerge.type,
      authSagas.secondAuthenticationForMerge
    )
  }
}
