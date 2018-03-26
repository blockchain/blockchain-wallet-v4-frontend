import { call, fork, put, take } from 'redux-saga/effects'
import * as A from './actions'
import * as AT from './actionTypes'
import { api } from 'services/ApiService'

const watchFee = function * (action) {
  while (true) {
    const action = yield take(AT.FETCH_BTC_FEE)
    yield call(fetchFee, action)
  }
}

const fetchFee = function * (action) {
  try {
    yield put(A.fetchFeeLoading())
    const data = yield call(api.getBitcoinFee)
    yield put(A.fetchFeeSuccess(data))
  } catch (e) {
    yield put(A.fetchFeeFailure(e.message))
  }
}

const watchRates = function * (action) {
  while (true) {
    const action = yield take(AT.FETCH_BTC_RATES)
    yield call(fetchRates, action)
  }
}

const fetchRates = function * (action) {
  try {
    yield put(A.fetchRatesLoading())
    const data = yield call(api.getBitcoinTicker)
    yield put(A.fetchRatesSuccess(data))
  } catch (e) {
    yield put(A.fetchRatesFailure(e.message))
  }
}

export default function * () {
  yield fork(watchFee)
  yield fork(watchRates)
}
