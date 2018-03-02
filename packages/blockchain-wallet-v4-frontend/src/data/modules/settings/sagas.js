import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import * as selectors from '../../selectors.js'

import { askSecondPasswordEnhancer } from 'services/SagaService'

export const initSettingsInfo = function * () {
  try {
    yield call(sagas.core.settings.fetchSettings)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init settings info.'))
  }
}

export const initSettingsPreferences = function * () {
  try {
    yield call(sagas.core.settings.fetchSettings)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init settings security.'))
  }
}

export const initSettingsSecurity = function * () {
  try {
    yield call(sagas.core.settings.fetchSettings)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init settings security.'))
  }
}

const showBackupRecovery = function * (action) {
  const recoverySaga = function * ({ password }) {
    const getMnemonic = s => selectors.core.wallet.getMnemonic(s, password)
    const eitherMnemonic = yield select(getMnemonic)
    if (eitherMnemonic.isRight) {
      const mnemonic = eitherMnemonic.value.split(' ')
      yield put(actions.modules.settings.addMnemonic({ mnemonic }))
    } else {
      yield put(actions.alerts.displayError('Could not read mnemonic.'))
    }
  }
  yield call(askSecondPasswordEnhancer(recoverySaga), {})
}

const showGoogleAuthenticatorSecretUrl = function * (action) {
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
    yield put(actions.alerts.displaySuccess('Mobile number has been verified!'))
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
    yield put(actions.alerts.displaySuccess('TOR blocking has been successfully updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update TOR blocking.'))
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

export const newHDAccount = function * (action) {
  try {
    yield call(askSecondPasswordEnhancer(sagas.core.wallet.newHDAccount), action.payload)
    yield put(actions.alerts.displaySuccess('Successfully created new wallet.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not create new wallet.'))
  }
}

export default function * () {
  yield takeLatest(AT.INIT_SETTINGS_INFO, initSettingsInfo)
  yield takeLatest(AT.INIT_SETTINGS_PREFERENCES, initSettingsPreferences)
  yield takeLatest(AT.SHOW_BACKUP_RECOVERY, showBackupRecovery)
  yield takeLatest(AT.SHOW_GOOGLE_AUTHENTICATOR_SECRET_URL, showGoogleAuthenticatorSecretUrl)
  yield takeLatest(AT.UPDATE_EMAIL, updateEmail)
  yield takeLatest(AT.VERIFY_EMAIL, verifyEmail)
  yield takeLatest(AT.UPDATE_MOBILE, updateMobile)
  yield takeLatest(AT.VERIFY_MOBILE, verifyMobile)
  yield takeLatest(AT.UPDATE_LANGUAGE, updateLanguage)
  yield takeLatest(AT.UPDATE_CURRENCY, updateCurrency)
  yield takeLatest(AT.UPDATE_BITCOIN_UNIT, updateBitcoinUnit)
  yield takeLatest(AT.UPDATE_AUTO_LOGOUT, updateAutoLogout)
  yield takeLatest(AT.UPDATE_LOGGING_LEVEL, updateLoggingLevel)
  yield takeLatest(AT.UPDATE_IP_LOCK, updateIpLock)
  yield takeLatest(AT.UPDATE_IP_LOCK_ON, updateIpLockOn)
  yield takeLatest(AT.UPDATE_BLOCK_TOR_IPS, updateBlockTorIps)
  yield takeLatest(AT.UPDATE_HINT, updateHint)
  yield takeLatest(AT.UPDATE_TWO_STEP_REMEMBER, updateTwoStepRemember)
  yield takeLatest(AT.ENABLE_TWO_STEP_MOBILE, enableTwoStepMobile)
  yield takeLatest(AT.ENABLE_TWO_STEP_GOOGLE_AUTHENTICATOR, enableTwoStepGoogleAuthenticator)
  yield takeLatest(AT.ENABLE_TWO_STEP_YUBIKEY, enableTwoStepYubikey)
  yield takeLatest(AT.NEW_HD_ACCOUNT, newHDAccount)
}
