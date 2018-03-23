import { call, fork, put, take } from 'redux-saga/effects'
import * as A from './actions'
import * as AT from './actionTypes'
import { api } from 'services/ApiService'

const watchPriceIndexSeries = function * (action) {
  while (true) {
    const action = yield take(AT.FETCH_PRICE_INDEX_SERIES)
    yield call(fetchPriceIndexSeries, action)
  }
}

const fetchPriceIndexSeries = function * (action) {
  try {
    const { coin, currency, start, scale, interval } = action.payload
    yield put(A.fetchPriceIndexSeriesLoading())
    const data = yield call(api.getPriceIndexSeries, coin, currency, start, scale)
    yield put(A.fetchPriceIndexSeriesSuccess(data))
  } catch (e) {
    yield put(A.fetchPriceIndexSeriesFailure(e.message))
  }
}

export default function * () {
  yield fork(watchPriceIndexSeries)
}
