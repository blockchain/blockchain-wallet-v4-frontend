import { takeEvery, call, put, select } from 'redux-saga/effects'
import * as actions from './actions'
import * as AT from './actionTypes'
import { selectors } from '../selectors'

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
      const { email } = action.payload
      const response = yield call(api.updateEmail, email)
      yield put(actions.updateEmailSuccess(response))
    } catch (error) {
      yield put(actions.updateEmailError(error))
    }
  }

  const updateMobile = function * (action) {
    try {
      const { mobile } = action.payload
      console.log(mobile)
      const guid = yield select(selectors.wallet.getGuid)
      console.log(guid)
      const sharedKey = yield select(selectors.wallet.getSharedKey)
      const response = yield call(api.updateMobile, guid, sharedKey, mobile)
      console.log(response)
      yield put(actions.updateMobileSuccess(response))
    } catch (error) {
      yield put(actions.updateMobileError(error))
    }
  }

  return function * () {
    yield takeEvery(AT.FETCH_SETTINGS, fetchSettings)
    yield takeEvery(AT.REQUEST_PAIRING_CODE, requestPairingCode)
    yield takeEvery(AT.UPDATE_EMAIL, updateEmail)
    yield takeEvery(AT.UPDATE_MOBILE, updateMobile)
  }
}
