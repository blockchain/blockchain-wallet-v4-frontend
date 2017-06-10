import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'

export const settingsSaga = ({ api } = {}) => {
  const fetchSettings = function * (action) {
    const { guid, sharedKey } = action.payload
    let response = yield call(api.getSettings, guid, sharedKey)
    yield put(A.loadSettingsData(response))
  }

  return function * () {
    yield takeEvery(A.SETTINGS_DATA_REQUEST, fetchSettings)
  }
}
