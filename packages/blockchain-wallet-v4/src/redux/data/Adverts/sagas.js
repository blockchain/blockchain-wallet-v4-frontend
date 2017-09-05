import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'

export const advertsSaga = ({ api } = {}) => {
  const fetchAdverts = function * (action) {
    try {
      const { number } = action.payload
      const response = yield call(api.getAdverts, number)
      yield put(A.fetchAdvertsSuccess(response))
    } catch (error) {
      yield put(A.fetchAdvertsError(error))
    }
  }

  return function * () {
    yield takeEvery(T.FETCH_ADVERTS, fetchAdverts)
  }
}
