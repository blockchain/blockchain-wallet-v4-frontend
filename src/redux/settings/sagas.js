import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'

export const settingsSaga = ({ api } = {}) => {
  const fetchSettings = function * (action) {
    const { guid, sharedKey } = action.payload
    try {
      let response = yield call(api.getSettings, guid, sharedKey)
      yield put(A.fetchSettingsSuccess(response))
    } catch (error) {
      yield put(A.fetchSettingsError(error))
    }
  }

  const requestPairingCode = function * (action) {
    const { guid, sharedKey } = action.payload
    try {
      let response = yield call(api.getPairingCode, guid, sharedKey)
      yield put(A.requestPairingCodeSuccess(response))
    } catch (error) {
      yield put(A.requestPairingCodeError(error))
    }
  }

  return function * () {
    yield takeEvery(T.FETCH_SETTINGS, fetchSettings)
    yield takeEvery(T.REQUEST_PAIRING_CODE, requestPairingCode)
  }
}
