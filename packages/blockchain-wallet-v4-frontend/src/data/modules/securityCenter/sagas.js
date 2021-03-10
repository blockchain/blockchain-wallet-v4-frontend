import { call, put } from 'redux-saga/effects'

import { actions } from 'data'
import * as C from 'services/alerts'

export default ({ coreSagas }) => {
  const logLocation = 'modules/securityCenter/sagas'

  const updateEmail = function * (action) {
    try {
      yield put(actions.modules.settings.clearEmailCodeFailure())
      yield call(coreSagas.settings.setEmail, action.payload)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateEmail', e))
      yield put(actions.alerts.displayError(C.EMAIL_UPDATE_ERROR))
    }
  }

  const getGoogleAuthenticatorSecretUrl = function * () {
    try {
      yield call(coreSagas.settings.requestGoogleAuthenticatorSecretUrl)
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'getGoogleAuthenticatorSecretUrl',
          e
        )
      )
      yield put(actions.alerts.displayError(C.GET_GOOGLEAUTH_SECRET_ERROR))
    }
  }

  const verifyEmail = function * (action) {
    try {
      yield put(actions.modules.settings.clearEmailCodeFailure())
      yield call(coreSagas.settings.setEmailVerified, action.payload)
      yield put(actions.alerts.displaySuccess(C.EMAIL_VERIFY_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'verifyEmail', e))
      yield put(actions.alerts.displayError(C.EMAIL_VERIFY_ERROR))
    }
  }

  const sendConfirmationCodeEmail = function * (action) {
    try {
      yield put(actions.modules.settings.clearEmailCodeFailure())
      yield call(coreSagas.settings.sendConfirmationCodeEmail, action.payload)
      yield put(actions.alerts.displaySuccess(C.EMAIL_CODE_SENT_SUCCESS))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'sendConfirmationCodeEmail',
          e
        )
      )
    }
  }

  const resendVerifyEmail = function * (action) {
    try {
      yield call(coreSagas.settings.resendVerifyEmail, action.payload)
      yield put(actions.alerts.displayInfo(C.VERIFY_EMAIL_SENT))
    } catch (e) {
      yield put(actions.alerts.displayError(C.VERIFY_EMAIL_SENT_ERROR))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'resendVerifyEmail', e)
      )
    }
  }

  const verifyEmailCode = function * (action) {
    try {
      yield call(coreSagas.settings.verifyEmailCode, action.payload)
    } catch (e) {
      yield put(actions.modules.settings.verifyEmailCodeFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'verifyEmailCode', e))
      yield put(actions.alerts.displayError(C.EMAIL_VERIFY_ERROR))
    }
  }

  const verifyGoogleAuthenticator = function * (action) {
    try {
      yield call(coreSagas.settings.setGoogleAuthenticator, action.payload)
      yield put(actions.alerts.displaySuccess(C.GOOGLE_AUTH_VERIFY_SUCCESS))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'verifyGoogleAuthenticator',
          e
        )
      )
      yield put(actions.alerts.displayError(C.GOOGLE_AUTH_VERIFY_ERROR))
    }
  }

  const setYubikey = function * (action) {
    try {
      yield call(coreSagas.settings.setYubikey, action.payload)
      yield put(actions.alerts.displaySuccess(C.YUBIKEY_VERIFY_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setYubikey', e))
      yield put(actions.alerts.displayError(C.YUBIKEY_VERIFY_ERROR))
    }
  }

  const sendMobileVerificationCode = function * (action) {
    try {
      yield call(coreSagas.settings.setMobile, action.payload)
      yield put(actions.alerts.displaySuccess(C.MOBILE_CODE_SENT_SUCCESS))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'sendMobileVerificationCode',
          e
        )
      )
      yield put(actions.alerts.displayError(C.MOBILE_CODE_SENT_ERROR))
    }
  }

  const verifyMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setMobileVerifiedAs2FA, action.payload)
      yield put(actions.alerts.displaySuccess(C.TWOFA_MOBILE_VERIFY_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'verifyMobile', e))
      yield put(actions.alerts.displayError(C.TWOFA_MOBILE_VERIFY_ERROR))
    }
  }

  const disableTwoStep = function * (action) {
    try {
      yield call(coreSagas.settings.setAuthType, action.payload)
      yield put(actions.alerts.displaySuccess(C.TWOFA_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'disableTwoStep', e))
      yield put(actions.alerts.displayError(C.TWOFA_UPDATE_ERROR))
    }
    yield put(actions.modals.closeAllModals())
  }

  const setVerifiedMobileAsTwoFactor = function * () {
    try {
      yield call(coreSagas.settings.setAuthType, { authType: '5' })
      yield put(actions.alerts.displaySuccess(C.TWOFA_MOBILE_VERIFY_SUCCESS))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'setVerifiedMobileAsTwoFactor',
          e
        )
      )
      yield put(actions.alerts.displayError(C.TWOFA_MOBILE_VERIFY_ERROR))
    }
  }

  return {
    updateEmail,
    verifyEmail,
    resendVerifyEmail,
    sendConfirmationCodeEmail,
    verifyEmailCode,
    getGoogleAuthenticatorSecretUrl,
    verifyGoogleAuthenticator,
    setYubikey,
    sendMobileVerificationCode,
    verifyMobile,
    disableTwoStep,
    setVerifiedMobileAsTwoFactor
  }
}
