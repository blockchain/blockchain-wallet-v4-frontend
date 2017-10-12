import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as sagas from '../sagas.js'

export const showPairingCode = function * (action) {
  try {
    const encryptionPhrase = yield call(sagas.core.settings.encodePairingCode)
    yield put(actions.modals.showModal('PairingCode', { data: encryptionPhrase }))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch pairing code.'))
  }
}

export const showGoogleAuthenticatorSecretUrl = function * (action) {
  try {
    const googleAuthenticatorSecretUrl = yield call(sagas.core.settings.requestGoogleAuthenticatorSecretUrl)
    yield put(actions.modals.showModal('TwoStepGoogleAuthenticator', { googleAuthenticatorSecretUrl }))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch google authenticator secret.'))
  }
}

export const updateEmail = function * (action) {
  try {
    yield call(sagas.core.settings.setEmail, action.payload)
    yield put(actions.alerts.displaySuccess('Email address has been successfully updated. Confirmation email has been sent.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update email address.'))
  }
}

export const verifyEmail = function * (action) {
  try {
    yield call(sagas.core.settings.setEmailVerified, action.payload)
    yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify email address.'))
  }
}

export const updateMobile = function * (action) {
  try {
    yield call(sagas.core.settings.setMobile, action.payload)
    yield put(actions.alerts.displaySuccess('Mobile number has been successfully updated. Verification SMS has been sent.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update mobile number.'))
  }
}

export const verifyMobile = function * (action) {
  try {
    yield call(sagas.core.settings.setMobileVerified, action.payload)
    yield put(actions.alerts.displaySuccess('Mobile number has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify mobile number.'))
  }
}

export const updateLanguage = function * (action) {
  try {
    yield call(sagas.core.settings.setLanguage, action.payload)
    yield put(actions.alerts.displaySuccess('Language has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update language.'))
  }
}

export const updateCurrency = function * (action) {
  try {
    yield call(sagas.core.settings.setCurrency, action.payload)
    yield put(actions.alerts.displaySuccess('Currency has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update currency.'))
  }
}

export const updateBitcoinUnit = function * (action) {
  try {
    yield call(sagas.core.settings.setBitcoinUnit, action.payload)
    yield put(actions.alerts.displaySuccess('Bitcoin unit has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update bitcoin unit.'))
  }
}

export const updateAutoLogout = function * (action) {
  try {
    yield call(sagas.core.settings.setAutoLogout, action.payload)
    yield put(actions.alerts.displaySuccess('Auto logout has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update auto logout.'))
  }
}

export const updateLoggingLevel = function * (action) {
  try {
    yield call(sagas.core.settings.setLoggingLevel, action.payload)
    yield put(actions.alerts.displaySuccess('Logging level has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update logging level.'))
  }
}

export const updateIpLock = function * (action) {
  try {
    yield call(sagas.core.settings.setIpLock, action.payload)
    yield put(actions.alerts.displaySuccess('IP whitelist has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update IP whitelist.'))
  }
}

export const updateIpLockOn = function * (action) {
  try {
    yield call(sagas.core.settings.setIpLockOn, action.payload)
    yield put(actions.alerts.displaySuccess('IP restriction has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update IP restriction.'))
  }
}

export const updateBlockTorIps = function * (action) {
  try {
    yield call(sagas.core.settings.setBlockTorIps, action.payload)
    yield put(actions.alerts.displaySuccess('Logging level has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update logging level.'))
  }
}

export const updateHint = function * (action) {
  try {
    yield call(sagas.core.settings.setHint, action.payload)
    yield put(actions.alerts.displaySuccess('Hint has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update hint.'))
  }
}

export const disableTwoStep = function * (action) {
  try {
    yield call(sagas.core.settings.setAuthType, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification has been successfully updated.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

export const updateTwoStepRemember = function * (action) {
  try {
    yield call(sagas.core.settings.setAuthTypeNeverSave, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification remember has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification remember.'))
  }
}

export const enableTwoStepMobile = function * (action) {
  try {
    yield call(sagas.core.settings.setAuthType, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification (Mobile) has been successfully enabled.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

export const enableTwoStepGoogleAuthenticator = function * (action) {
  try {
    yield call(sagas.core.settings.setGoogleAuthenticator, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification (Google Authenticator) has been successfully enabled.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

export const enableTwoStepYubikey = function * (action) {
  try {
    yield call(sagas.core.settings.setYubikey, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification (Yubikey) has been successfully enabled.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

export default function * () {
  yield takeEvery(AT.SHOW_PAIRING_CODE, showPairingCode)
  yield takeEvery(AT.SHOW_GOOGLE_AUTHENTICATOR_SECRET_URL, showGoogleAuthenticatorSecretUrl)
  yield takeEvery(AT.UPDATE_EMAIL, updateEmail)
  yield takeEvery(AT.VERIFY_EMAIL, verifyEmail)
  yield takeEvery(AT.UPDATE_MOBILE, updateMobile)
  yield takeEvery(AT.VERIFY_MOBILE, verifyMobile)
  yield takeEvery(AT.UPDATE_LANGUAGE, updateLanguage)
  yield takeEvery(AT.UPDATE_CURRENCY, updateCurrency)
  yield takeEvery(AT.UPDATE_BITCOIN_UNIT, updateBitcoinUnit)
  yield takeEvery(AT.UPDATE_AUTO_LOGOUT, updateAutoLogout)
  yield takeEvery(AT.UPDATE_LOGGING_LEVEL, updateLoggingLevel)
  yield takeEvery(AT.UPDATE_IP_LOCK, updateIpLock)
  yield takeEvery(AT.UPDATE_IP_LOCK_ON, updateIpLockOn)
  yield takeEvery(AT.UPDATE_BLOCK_TOR_IPS, updateBlockTorIps)
  yield takeEvery(AT.UPDATE_HINT, updateHint)
  yield takeEvery(AT.DISABLE_TWO_STEP, disableTwoStep)
  yield takeEvery(AT.UPDATE_TWO_STEP_REMEMBER, updateTwoStepRemember)
  yield takeEvery(AT.ENABLE_TWO_STEP_MOBILE, enableTwoStepMobile)
  yield takeEvery(AT.ENABLE_TWO_STEP_GOOGLE_AUTHENTICATOR, enableTwoStepGoogleAuthenticator)
  yield takeEvery(AT.ENABLE_TWO_STEP_YUBIKEY, enableTwoStepYubikey)
}
