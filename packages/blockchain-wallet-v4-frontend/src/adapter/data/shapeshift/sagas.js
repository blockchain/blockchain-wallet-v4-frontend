import { call, fork, put, take, takeEvery } from 'redux-saga/effects'
import { compose, dissoc, map, negate, mapObjIndexed, sortBy, sum, prop, values } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import { api } from 'services/ApiService'

const fetchPair = function * (action) {
  try {
    const { pair } = action.payload
    yield put(A.fetchShapeshiftPairLoading(pair))
    const data = yield call(api.getPair, pair)
    yield put(A.fetchShapeshiftPairSuccess(pair, data))
  } catch (e) {
    yield put(A.fetchShapeshiftPairFailure(pair, e.message))
  }
}

export default function * () {
  yield takeEvery(AT.FETCH_SHAPESHIFT_PAIR, fetchPair)
}
