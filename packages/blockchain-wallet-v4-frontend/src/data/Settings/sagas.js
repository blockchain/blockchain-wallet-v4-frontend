import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actions } from 'data'
import { settingsSaga } from 'blockchain-wallet-v4/src/redux/settings/sagas.js'
import { api } from 'services/ApiService'
import settings from 'config'

const settingsSagas = settingsSaga({ api, walletPath: settings.WALLET_IMMUTABLE_PATH })

const initSettings = function * (action) {
  try {
    yield call(settingsSagas.fetchSettings)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch settings.'))
  }
}

const showPairingCode = function * (action) {
  try {
    const encryptionPhrase = yield call(settingsSagas.encodePairingCode)
    yield put(actions.modals.showModal('PairingCode', { data: encryptionPhrase }))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch pairing code.'))
  }
}

const showGoogleAuthenticatorSecretUrl = function * (action) {
  try {
    const googleAuthenticatorSecretUrl = yield call(settingsSagas.requestGoogleAuthenticatorSecretUrl)
    yield put(actions.modals.showModal('TwoStepGoogleAuthenticator', { googleAuthenticatorSecretUrl }))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch google authenticator secret.'))
  }
}

const updateEmail = function * (action) {
  try {
    yield call(settingsSagas.setEmail, action.payload)
    yield put(actions.alerts.displaySuccess('Email address has been successfully updated. Confirmation email has been sent.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update email address.'))
  }
}

const verifyEmail = function * (action) {
  try {
    yield call(settingsSagas.setEmailVerified, action.payload)
    yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify email address.'))
  }
}

const updateMobile = function * (action) {
  try {
    yield call(settingsSagas.setMobile, action.payload)
    yield put(actions.alerts.displaySuccess('Mobile number has been successfully updated. Verification SMS has been sent.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update mobile number.'))
  }
}

const verifyMobile = function * (action) {
  try {
    yield call(settingsSagas.setMobileVerified, action.payload)
    yield put(actions.alerts.displaySuccess('Mobile number has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify mobile number.'))
  }
}

const updateLanguage = function * (action) {
  try {
    yield call(settingsSagas.setLanguage, action.payload)
    yield put(actions.alerts.displaySuccess('Language has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update language.'))
  }
}

const updateCurrency = function * (action) {
  try {
    yield call(settingsSagas.setCurrency, action.payload)
    yield put(actions.alerts.displaySuccess('Currency has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update currency.'))
  }
}

const updateBitcoinUnit = function * (action) {
  try {
    yield call(settingsSagas.setBitcoinUnit, action.payload)
    yield put(actions.alerts.displaySuccess('Bitcoin unit has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update bitcoin unit.'))
  }
}

const updateAutoLogout = function * (action) {
  try {
    yield call(settingsSagas.setAutoLogout, action.payload)
    yield put(actions.alerts.displaySuccess('Auto logout has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update auto logout.'))
  }
}

const updateLoggingLevel = function * (action) {
  try {
    yield call(settingsSagas.setLoggingLevel, action.payload)
    yield put(actions.alerts.displaySuccess('Logging level has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update logging level.'))
  }
}

const updateIpLock = function * (action) {
  try {
    yield call(settingsSagas.setIpLock, action.payload)
    yield put(actions.alerts.displaySuccess('IP whitelist has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update IP whitelist.'))
  }
}

const updateIpLockOn = function * (action) {
  try {
    yield call(settingsSagas.setIpLockOn, action.payload)
    yield put(actions.alerts.displaySuccess('IP restriction has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update IP restriction.'))
  }
}

const updateBlockTorIps = function * (action) {
  try {
    yield call(settingsSagas.setBlockTorIps, action.payload)
    yield put(actions.alerts.displaySuccess('Logging level has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update logging level.'))
  }
}

const updateHint = function * (action) {
  try {
    yield call(settingsSagas.setHint, action.payload)
    yield put(actions.alerts.displaySuccess('Hint has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update hint.'))
  }
}

const disableTwoStep = function * (action) {
  try {
    yield call(settingsSagas.setAuthType, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification has been successfully updated.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

const updateTwoStepRemember = function * (action) {
  try {
    yield call(settingsSagas.setAuthTypeNeverSave, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification remember has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification remember.'))
  }
}

const enableTwoStepMobile = function * (action) {
  try {
    yield call(settingsSagas.setAuthType, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification (Mobile) has been successfully enabled.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

const enableTwoStepGoogleAuthenticator = function * (action) {
  try {
    yield call(settingsSagas.setGoogleAuthenticator, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification (Google Authenticator) has been successfully enabled.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

const enableTwoStepYubikey = function * (action) {
  try {
    yield call(settingsSagas.setYubikey, action.payload)
    yield put(actions.alerts.displaySuccess('2-step verification (Yubikey) has been successfully enabled.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

const sagas = function * () {
  yield takeEvery(AT.INIT_SETTINGS, initSettings)
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

export default sagas
