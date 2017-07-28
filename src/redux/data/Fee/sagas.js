import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'

export const feeSaga = ({ api } = {}) => {
  const fetchFee = function * () {
    try {
      let response = yield call(api.getFee)
      yield put(A.fetchFeeSuccess(response))
    } catch (error) {
      yield put(A.fetchFeeError(error))
    }
  }

  return function * () {
    yield takeEvery(T.FETCH_FEE, fetchFee)
  }
}
