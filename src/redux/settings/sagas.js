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

  return function * () {
    yield takeEvery(T.FETCH_SETTINGS, fetchSettings)
  }
}
