import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actions } from 'data'
import { settingsSaga } from 'blockchain-wallet-v4/src/redux/settings/sagas.js'
import { api } from 'services/ApiService'
import settings from 'config'

const settingsSagas = settingsSaga({ api, settingsPath: settings.SETTINGS_PATH })

const initSettings = function * (action) {
  try {
    yield call(settingsSagas.setSettings)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch settings.'))
  }
}

const showPairingCode = function * (action) {
  try {
    const encryptionPhrase = yield call(settingsSagas.requestPairingCode)
    yield put(actions.modal.showModal('PairingCode', { data: encryptionPhrase }))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch pairing code.'))
  }
}

const showGoogleAuthenticatorSecretUrl = function * (action) {
  try {
    const googleAuthenticatorSecretUrl = yield call(settingsSagas.requestGoogleAuthenticatorSecretUrl)
    yield put(actions.modal.showModal('TwoStepGoogleAuthenticator', { googleAuthenticatorSecretUrl }))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch google authenticator secret.'))
  }
}

const updateEmail = function * (action) {
  try {
    yield call(settingsSagas.setEmail, action)
    yield put(actions.alerts.displaySuccess('Email address has been successfully updated. Confirmation email has been sent.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update email address.'))
  }
}

const verifyEmail = function * (action) {
  try {
    yield call(settingsSagas.setEmailVerified, action)
    yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify email address.'))
  }
}

const updateMobile = function * (action) {
  try {
    yield call(settingsSagas.setMobile, action)
    yield put(actions.alerts.displaySuccess('Mobile number has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update mobile number.'))
  }
}

const verifyMobile = function * (action) {
  try {
    yield call(settingsSagas.setMobileVerified, action)
    yield put(actions.alerts.displaySuccess('Mobile number has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify mobile number.'))
  }
}

const updateLanguage = function * (action) {
  try {
    yield call(settingsSagas.setLanguage, action)
    yield put(actions.alerts.displaySuccess('Language has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update language.'))
  }
}

const updateCurrency = function * (action) {
  try {
    yield call(settingsSagas.setCurrency, action)
    yield put(actions.alerts.displaySuccess('Currency has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update currency.'))
  }
}

const updateBitcoinUnit = function * (action) {
  try {
    yield call(settingsSagas.setBitcoinUnit, action)
    yield put(actions.alerts.displaySuccess('Bitcoin unit has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update bitcoin unit.'))
  }
}

const updateAutoLogout = function * (action) {
  try {
    yield call(settingsSagas.setAutoLogout, action)
    yield put(actions.alerts.displaySuccess('Auto logout has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update auto logout.'))
  }
}

const updateLoggingLevel = function * (action) {
  try {
    yield call(settingsSagas.setLoggingLevel, action)
    yield put(actions.alerts.displaySuccess('Logging level has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update logging level.'))
  }
}

const updateIpLock = function * (action) {
  try {
    yield call(settingsSagas.setIpLock, action)
    yield put(actions.alerts.displaySuccess('IP whitelist has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update IP whitelist.'))
  }
}

const updateIpLockOn = function * (action) {
  try {
    yield call(settingsSagas.setIpLockOn, action)
    yield put(actions.alerts.displaySuccess('IP restriction has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update IP restriction.'))
  }
}

const updateBlockTorIps = function * (action) {
  try {
    yield call(settingsSagas.setLoggingLevel, action)
    yield put(actions.alerts.displaySuccess('Logging level has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update logging level.'))
  }
}

const updateHint = function * (action) {
  try {
    yield call(settingsSagas.setHint, action)
    yield put(actions.alerts.displaySuccess('Hint has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update hint.'))
  }
}

const updateAuthType = function * (action) {
  try {
    yield call(settingsSagas.updateAuthType, action)
    yield put(actions.alerts.displaySuccess('2-step verification has been successfully updated.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

const updateAuthTypeNeverSave = function * (action) {
  try {
    yield call(settingsSagas.updateAuthTypeNeverSave, action)
    yield put(actions.alerts.displaySuccess('2-step verification remember has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification remember.'))
  }
}

const enableGoogleAuthenticator = function * (action) {
  try {
    yield call(settingsSagas.enableGoogleAuthenticator, action)
    yield put(actions.alerts.displaySuccess('2-step verification has been successfully updated.'))
    yield put(actions.modals.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
    yield put(actions.modals.closeModal())
  }
}

const enableYubikey = function * (action) {
  try {
    yield call(settingsSagas.enableYubikey, action)
    yield put(actions.alerts.displaySuccess('2-step verification has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update 2-step verification.'))
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
  yield takeEvery(AT.UPDATE_AUTH_TYPE, updateAuthType)
  yield takeEvery(AT.UPDATE_AUTH_TYPE_NEVER_SAVE, updateAuthTypeNeverSave)
  yield takeEvery(AT.ENABLE_GOOGLE_AUTHENTICATOR, enableGoogleAuthenticator)
  yield takeEvery(AT.ENABLE_YUBIKEY, enableYubikey)
}

export default sagas
