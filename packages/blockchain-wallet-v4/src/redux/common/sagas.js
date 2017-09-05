import { call, put, takeEvery } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'

export const commonSaga = ({ api } = {}) => {
  const fetchBlockchainDataSaga = function * (action) {
    try {
      const context = action.payload
      const data = yield call(api.fetchBlockchainData, context, { n: 1 })
      yield put(A.fetchBlockchainDataSuccess(data))
    } catch (error) {
      // control blank context?
      yield put(A.fetchBlockchainDataError(error))
    }
  }

  return function * () {
    yield takeEvery(T.FETCH_BLOCKCHAIN_DATA, fetchBlockchainDataSaga)
  }
}
