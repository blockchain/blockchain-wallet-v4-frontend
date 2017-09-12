import { takeEvery, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import * as AT from './actionTypes'
import { contains, toLower } from 'ramda'

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
      const { guid, sharedKey } = action.payload
      // Get guid, sharedKey, password and PAIRING_CODE_PBKDF2_ITERATIONS
      const password = ''
      const iterations = ''
      let response = yield call(api.getPairingCode, guid, sharedKey)
      // TODO /!\ : Convert to right format : https://github.com/blockchain/My-Wallet-V3/blob/master/src/wallet.js#L187
      yield put(actions.requestPairingCodeSuccess(response))
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
      console.log(response)
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
      console.log(response)
      if (contains('Updated IP Lock Settings', response)) {
        yield put(actions.updateIpLockSuccess(ipLock, response))
      } else {
        yield put(actions.updateIpLockError(response))
      }
    } catch (error) {
      yield put(actions.updateIpLockError(error))
    }
  }

  const updateBlockTorIps = function * (action) {
    try {
      const { guid, sharedKey, blockTorIps } = action.payload
      const response = yield call(api.BlockTorIps, guid, sharedKey, blockTorIps)
      console.log(response)
      if (contains('Tor IP address settings updated.', response)) {
        yield put(actions.updateBlockTorIpsSuccess(blockTorIps, response))
      } else {
        yield put(actions.updateBlockTorIpsError(response))
      }
    } catch (error) {
      yield put(actions.updateBlockTorIpsError(error))
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
    yield takeEvery(AT.UPDATE_BLOCK_TOR_IPS, updateBlockTorIps)
  }
}
