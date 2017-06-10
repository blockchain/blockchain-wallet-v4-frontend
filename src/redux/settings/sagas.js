import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'

export const settingsSaga = ({ api } = {}) => {
  const fetchSettings = function * (action) {
    const { guid, sharedKey } = action.payload
    console.log(guid, sharedKey, action)
    let response = yield call(api.getSettings, guid, sharedKey)
    // dispatch to reducers
    yield put(A.loadSettingsData(response))
  }

  return function * () {
    yield takeEvery(A.SETTINGS_DATA_REQUEST, fetchSettings)
  }
}
