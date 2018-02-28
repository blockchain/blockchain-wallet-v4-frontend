
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { set } from 'ramda-lens'
import * as A from './actions'
import * as AT from './actionTypes'


export const refreshSaga = ({ api } = {}) => {
  const refresh = function * () {
    try {
      yield put(A.refreshLoading())

      // all the api calls here

      yield put(A.refreshSuccess(data)) // call success with whatever data we get
    } catch (e) {
      yield put(A.refreshFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.REFRESH, refresh)
  }
}
