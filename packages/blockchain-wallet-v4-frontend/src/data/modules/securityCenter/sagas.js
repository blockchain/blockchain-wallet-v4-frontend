import { put, call } from 'redux-saga/effects'
import * as actions from '../../actions.js'

export default ({ coreSagas }) => {
  const logLocation = 'modules/securityCenter/sagas'

  const updateEmail = function * (action) {
    try {
      yield put(actions.modules.settings.clearEmailCodeFailure())
      yield call(coreSagas.settings.setEmail, action.payload)
      yield put(actions.alerts.displaySuccess('Your email has been updated and your confirmation code has been sent.'))
      yield call(coreSagas.settings.sendConfirmationCodeEmail, action.payload)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateEmail', e))
      yield put(actions.alerts.displayError('Failed to update email address.'))
    }
  }

  const getGoogleAuthenticatorSecretUrl = function * () {
    try {
      yield call(coreSagas.settings.requestGoogleAuthenticatorSecretUrl)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'getGoogleAuthenticatorSecretUrl', e))
      yield put(actions.alerts.displayError('Failed to fetch Google Authenticator secret.'))
    }
  }

  const verifyEmail = function * (action) {
    try {
      yield put(actions.modules.settings.clearEmailCodeFailure())
      yield call(coreSagas.settings.setEmailVerified, action.payload)
      yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'verifyEmail', e))
      yield put(actions.alerts.displaySuccess('Failed to verify email address.'))
    }
  }

  const sendConfirmationCodeEmail = function * (action) {
    try {
      yield put(actions.modules.settings.clearEmailCodeFailure())
      yield call(coreSagas.settings.sendConfirmationCodeEmail, action.payload)
      yield put(actions.alerts.displaySuccess('Confirmation code has been sent.'))
    } catch (e) {
      yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
      yield put(actions.logs.logErrorMessage(logLocation, 'sendConfirmationCodeEmail', e))
    }
  }

  const verifyEmailCode = function * (action) {
    try {
      yield call(coreSagas.settings.verifyEmailCode, action.payload)
      yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
    } catch (e) {
      yield put(actions.modules.settings.verifyEmailCodeFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'verifyEmailCode', e))
      yield put(actions.alerts.displayError('Failed to verify email code.'))
    }
  }

  const verifyGoogleAuthenticator = function * (action) {
    try {
      yield call(coreSagas.settings.setGoogleAuthenticator, action.payload)
      yield put(actions.alerts.displaySuccess('Google auth verified!'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'verifyGoogleAuthenticator', e))
      yield put(actions.alerts.displayError('Failed to verify Google Authenticator code.'))
    }
  }

  const setYubikey = function * (action) {
    try {
      yield call(coreSagas.settings.setYubikey, action.payload)
      yield put(actions.alerts.displaySuccess('Yubikey verified!'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setYubikey', e))
      yield put(actions.alerts.displayError('Failed to verify Yubikey.'))
    }
  }

  const sendMobileVerificationCode = function * (action) {
    try {
      yield call(coreSagas.settings.setMobile, action.payload)
      yield put(actions.alerts.displaySuccess('Mobile verification code sent!'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sendMobileVerificationCode', e))
      yield put(actions.alerts.displayError('Failed to send mobile verification code.'))
    }
  }

  const verifyMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setMobileVerifiedAs2FA, action.payload)
      yield put(actions.alerts.displaySuccess('SMS has been successfully verified as two factor auth method.'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'verifyMobile', e))
      yield put(actions.alerts.displayError('Failed to verify mobile number.'))
    }
  }

  const disableTwoStep = function * (action) {
    try {
      yield call(coreSagas.settings.setAuthType, action.payload)
      yield put(actions.alerts.displaySuccess('2FA has been successfully updated.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'disableTwoStep', e))
      yield put(actions.alerts.displayError('Failed to update 2FA setting.'))
      yield put(actions.modals.closeModal())
    }
  }

  const setVerifiedMobileAsTwoFactor = function * () {
    try {
      yield call(coreSagas.settings.setAuthType, { authType: '5' })
      yield put(actions.alerts.displaySuccess('Your verified mobile number is now your 2FA method.'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setVerifiedMobileAsTwoFactor', e))
      yield put(actions.alerts.displayError('Failed to update 2FA setting.'))
    }
  }

  return {
    updateEmail,
    verifyEmail,
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
