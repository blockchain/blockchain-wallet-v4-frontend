import { call, fork, put, take } from 'redux-saga/effects'
import * as A from './actions'
import * as AT from './actionTypes'
import { api } from '../../services'

const watchRates = function * (action) {
  while (true) {
    const action = yield take(AT.FETCH_BTC_RATES)
    yield call(fetchBchRates, action)
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
  yield fork(fetchRates)
}
