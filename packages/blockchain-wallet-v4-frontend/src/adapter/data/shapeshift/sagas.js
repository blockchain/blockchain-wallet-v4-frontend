import { call, fork, put, take, takeEvery } from 'redux-saga/effects'
import { compose, dissoc, has, map, negate, mapObjIndexed, sortBy, sum, prop, values } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import { api } from 'services/ApiService'

const fetchOrder = function * (action) {
  try {
    const { depositAmount, pair, returnAddress, withdrawal } = action.payload
    yield put(A.fetchOrderLoading())
    const data = yield call(api.createOrder, depositAmount, pair, returnAddress, withdrawal)
    if (has('error', data)) {
      yield put(A.fetchOrderFailure(prop('error', data)))
    } else {
      yield put(A.fetchOrderSuccess(prop('success', data)))
    }
  } catch (e) {
    yield put(A.fetchOrderFailure(e.message))
  }
}

const fetchPair = function * (action) {
  try {
    const { pair } = action.payload
    yield put(A.fetchPairLoading(pair))
    const data = yield call(api.getPair, pair)
    yield put(A.fetchPairSuccess(pair, data))
  } catch (e) {
    yield put(A.fetchPairFailure(pair, e.message))
  }
}

export default function * () {
  yield takeEvery(AT.FETCH_SHAPESHIFT_ORDER, fetchOrder)
  yield takeEvery(AT.FETCH_SHAPESHIFT_PAIR, fetchPair)
}
