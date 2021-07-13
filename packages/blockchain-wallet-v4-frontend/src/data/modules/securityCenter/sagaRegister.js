import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const securityCenterSagas = sagas({ coreSagas })

  return function* securityCenterSaga() {
    yield takeLatest(AT.UPDATE_EMAIL, securityCenterSagas.updateEmail)
    yield takeLatest(AT.VERIFY_EMAIL, securityCenterSagas.verifyEmail)
    yield takeLatest(AT.SEND_CONFIRMATION_CODE_EMAIL, securityCenterSagas.sendConfirmationCodeEmail)
    yield takeLatest(AT.VERIFY_EMAIL_CODE, securityCenterSagas.verifyEmailCode)
    yield takeLatest(AT.RESEND_VERIFY_EMAIL, securityCenterSagas.resendVerifyEmail)
    yield takeLatest(
      AT.GET_GOOGLE_AUTHENTICATOR_SECRET_URL,
      securityCenterSagas.getGoogleAuthenticatorSecretUrl
    )
    yield takeLatest(AT.VERIFY_GOOGLE_AUTHENTICATOR, securityCenterSagas.verifyGoogleAuthenticator)
    yield takeLatest(AT.SET_YUBIKEY, securityCenterSagas.setYubikey)
    yield takeLatest(
      AT.SEND_MOBILE_VERIFICATION_CODE,
      securityCenterSagas.sendMobileVerificationCode
    )
    yield takeLatest(AT.VERIFY_MOBILE_SECURITY_CENTER, securityCenterSagas.verifyMobile)
    yield takeLatest(AT.DISABLE_TWO_STEP, securityCenterSagas.disableTwoStep)
    yield takeLatest(
      AT.SET_VERIFIED_MOBILE_AS_TWO_FACTOR,
      securityCenterSagas.setVerifiedMobileAsTwoFactor
    )
  }
}
