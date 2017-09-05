import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'

export const logsSaga = ({ api } = {}) => {
  const fetchLogs = function * (action) {
    try {
      const { guid, sharedKey } = action.payload
      const response = yield call(api.getLogs, guid, sharedKey)
      const { results } = response
      yield put(A.fetchLogsSuccess(results))
    } catch (error) {
      yield put(A.fetchLogsError(error))
    }
  }

  return function * () {
    yield takeEvery(T.FETCH_LOGS, fetchLogs)
  }
}
