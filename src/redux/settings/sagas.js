import { takeEvery, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import * as AT from './actionTypes'
import { selectors } from '../selectors'
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
      if (contains('successfully', toLower(response))) {
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

  return function * () {
    yield takeEvery(AT.FETCH_SETTINGS, fetchSettings)
    yield takeEvery(AT.REQUEST_PAIRING_CODE, requestPairingCode)
    yield takeEvery(AT.UPDATE_EMAIL, updateEmail)
    yield takeEvery(AT.UPDATE_MOBILE, updateMobile)
    yield takeEvery(AT.VERIFY_MOBILE, verifyMobile)
  }
}
