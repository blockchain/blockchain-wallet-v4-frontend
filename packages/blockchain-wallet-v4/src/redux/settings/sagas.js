import { takeEvery, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import * as AT from './actionTypes'
import { contains, toLower } from 'ramda'
import { pairing } from 'blockchain-wallet-v4/src'

export const settingsSaga = ({ api } = {}) => {
  const fetchSettings = function * (action) {
    const { guid, sharedKey } = action.payload
    try {
      let response = yield call(api.getSettings, guid, sharedKey)
      yield put(actions.fetchSettingsSuccess(response))
    } catch (error) {
      yield put(actions.fetchSettingsError(error))
    }
  }

  const requestPairingCode = function * (action) {
    try {
      const { guid, sharedKey, password } = action.payload
      console.log(guid, sharedKey, password)
      const pairingPassword = yield call(api.getPairingPassword, guid)
      console.log(pairingPassword)
      const data = pairing.encode(guid, sharedKey, password, pairingPassword)
      console.log(data)
      yield put(actions.requestPairingCodeSuccess(data))
    } catch (error) {
      yield put(actions.requestPairingCodeError(error))
    }
  }

  const updateEmail = function * (action) {
    try {
      const { guid, sharedKey, email } = action.payload
      const response = yield call(api.updateEmail, guid, sharedKey, email)
      if (contains('updated', toLower(response))) {
        yield put(actions.updateEmailSuccess(email, response))
      } else {
        yield put(actions.updateEmailError(response))
      }
    } catch (error) {
      yield put(actions.updateEmailError(error))
    }
  }

  const updateMobile = function * (action) {
    try {
      const { guid, sharedKey, mobile } = action.payload
      const response = yield call(api.updateMobile, guid, sharedKey, mobile)
      if (contains('successfully', toLower(response))) {
        yield put(actions.updateMobileSuccess(mobile, response))
      } else {
        yield put(actions.updateMobileError(response))
      }
    } catch (error) {
      yield put(actions.updateMobileError(error))
    }
  }

  const verifyMobile = function * (action) {
    try {
      const { guid, sharedKey, code } = action.payload
      const response = yield call(api.verifyMobile, guid, sharedKey, code)
      if (contains('successfully', toLower(response))) {
        yield put(actions.verifyMobileSuccess(code, response))
      } else {
        yield put(actions.verifyMobileError(response))
      }
    } catch (error) {
      yield put(actions.verifyMobileError(error))
    }
  }

  const updateLanguage = function * (action) {
    try {
      const { guid, sharedKey, language } = action.payload
      const response = yield call(api.updateLanguage, guid, sharedKey, language)
      if (contains('successfully', toLower(response))) {
        yield put(actions.updateLanguageSuccess(language, response))
      } else {
        yield put(actions.updateLanguageError(response))
      }
    } catch (error) {
      yield put(actions.updateLanguageError(error))
    }
  }

  const updateCurrency = function * (action) {
    try {
      const { guid, sharedKey, currency } = action.payload
      const response = yield call(api.updateCurrency, guid, sharedKey, currency)
      if (contains('successfully', toLower(response))) {
        yield put(actions.updateCurrencySuccess(currency, response))
      } else {
        yield put(actions.updateCurrencyError(response))
      }
    } catch (error) {
      yield put(actions.updateCurrencyError(error))
    }
  }

  const updateBitcoinUnit = function * (action) {
    try {
      const { guid, sharedKey, unit } = action.payload
      const response = yield call(api.updateBitcoinUnit, guid, sharedKey, unit)
      if (contains('successfully', toLower(response))) {
        yield put(actions.updateBitcoinUnitSuccess(unit, response))
      } else {
        yield put(actions.updateBitcoinUnitError(response))
      }
    } catch (error) {
      yield put(actions.updateBitcoinUnitError(error))
    }
  }

  const updateAutoLogout = function * (action) {
    try {
      const { guid, sharedKey, autoLogout } = action.payload
      const response = yield call(api.updateAutoLogout, guid, sharedKey, autoLogout)
      if (contains('successfully', toLower(response))) {
        yield put(actions.updateAutoLogoutSuccess(autoLogout, response))
      } else {
        yield put(actions.updateAutoLogoutError(response))
      }
    } catch (error) {
      yield put(actions.updateAutoLogoutError(error))
    }
  }

  const updateLoggingLevel = function * (action) {
    try {
      const { guid, sharedKey, loggingLevel } = action.payload
      const response = yield call(api.updateLoggingLevel, guid, sharedKey, loggingLevel)
      if (contains('Logging level updated.', response)) {
        yield put(actions.updateLoggingLevelSuccess(loggingLevel, response))
      } else {
        yield put(actions.updateLoggingLevelError(response))
      }
    } catch (error) {
      yield put(actions.updateLoggingLevelError(error))
    }
  }

  const updateIpLock = function * (action) {
    try {
      const { guid, sharedKey, ipLock } = action.payload
      const response = yield call(api.updateIpLock, guid, sharedKey, ipLock)
      if (contains('Ip Addresses Updated', response)) {
        yield put(actions.updateIpLockSuccess(ipLock, response))
      } else {
        yield put(actions.updateIpLockError(response))
      }
    } catch (error) {
      yield put(actions.updateIpLockError(error))
    }
  }

  const updateIpLockOn = function * (action) {
    try {
      const { guid, sharedKey, ipLockOn } = action.payload
      const response = yield call(api.updateIpLockOn, guid, sharedKey, ipLockOn)
      if (contains('Updated IP Lock Settings', response)) {
        yield put(actions.updateIpLockOnSuccess(ipLockOn, response))
      } else {
        yield put(actions.updateIpLockOnError(response))
      }
    } catch (error) {
      yield put(actions.updateIpLockOnError(error))
    }
  }

  const updateBlockTorIps = function * (action) {
    try {
      const { guid, sharedKey, blockTorIps } = action.payload
      const response = yield call(api.updateBlockTorIps, guid, sharedKey, blockTorIps)
      if (contains('Tor IP address settings updated.', response)) {
        yield put(actions.updateBlockTorIpsSuccess(blockTorIps, response))
      } else {
        yield put(actions.updateBlockTorIpsError(response))
      }
    } catch (error) {
      yield put(actions.updateBlockTorIpsError(error))
    }
  }

  const updateHint = function * (action) {
    try {
      const { guid, sharedKey, hint } = action.payload
      const response = yield call(api.updateHint, guid, sharedKey, hint)
      if (contains('Updated Password Hint', response)) {
        yield put(actions.updateHintSuccess(hint, response))
      } else {
        yield put(actions.updateHintError(response))
      }
    } catch (error) {
      yield put(actions.updateHintError(error))
    }
  }

  const updateAuthType = function * (action) {
    try {
      const { guid, sharedKey, authType } = action.payload
      const response = yield call(api.updateAuthType, guid, sharedKey, authType)
      if (contains('updated', response)) {
        yield put(actions.updateAuthTypeSuccess(authType, response))
      } else {
        yield put(actions.updateAuthTypeError(response))
      }
    } catch (error) {
      yield put(actions.updateAuthTypeError(error))
    }
  }

  const updateAuthTypeNeverSave = function * (action) {
    try {
      const { guid, sharedKey, authTypeNeverSave } = action.payload
      const response = yield call(api.updateAuthTypeNeverSave, guid, sharedKey, authTypeNeverSave)
      if (contains('Success', response)) {
        yield put(actions.updateAuthTypeNeverSaveSuccess(authTypeNeverSave ? 1 : 0, response))
      } else {
        yield put(actions.updateAuthTypeNeverSaveError(response))
      }
    } catch (error) {
      yield put(actions.updateAuthTypeNeverSaveError(error))
    }
  }

  const getGoogleAuthenticatorSecretUrl = function * (action) {
    try {
      const { guid, sharedKey } = action.payload
      const response = yield call(api.getGoogleAuthenticatorSecretUrl, guid, sharedKey)
      if (contains('secret', response)) {
        yield put(actions.getGoogleAuthenticatorSecretUrlSuccess(response))
      } else {
        yield put(actions.getGoogleAuthenticatorSecretUrlError(response))
      }
    } catch (error) {
      yield put(actions.getGoogleAuthenticatorSecretUrlError(error))
    }
  }

  const confirmGoogleAuthenticatorSetup = function * (action) {
    try {
      const { guid, sharedKey, code } = action.payload
      const response = yield call(api.confirmGoogleAuthenticatorSetup, guid, sharedKey, code)
      if (contains('updated', response)) {
        yield put(actions.confirmGoogleAuthenticatorSetupSuccess(response))
      } else {
        yield put(actions.confirmGoogleAuthenticatorSetupError(response))
      }
    } catch (error) {
      yield put(actions.confirmGoogleAuthenticatorSetupError(error))
    }
  }

  const enableYubikey = function * (action) {
    try {
      const { guid, sharedKey, code } = action.payload
      const response = yield call(api.enableYubikey, guid, sharedKey, code)

      if (contains('updated', response)) {
        yield put(actions.enableYubikeySuccess(response))
      } else {
        yield put(actions.enableYubikeyError(response))
      }
    } catch (error) {
      yield put(actions.enableYubikeyError(error))
    }
  }

  return function * () {
    yield takeEvery(AT.FETCH_SETTINGS, fetchSettings)
    yield takeEvery(AT.REQUEST_PAIRING_CODE, requestPairingCode)
    yield takeEvery(AT.UPDATE_EMAIL, updateEmail)
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
    yield takeEvery(AT.GET_GOOGLE_AUTHENTICATOR_SECRET_URL, getGoogleAuthenticatorSecretUrl)
    yield takeEvery(AT.CONFIRM_GOOGLE_AUTHENTICATOR_SETUP, confirmGoogleAuthenticatorSetup)
    yield takeEvery(AT.ENABLE_YUBIKEY, enableYubikey)
  }
}
