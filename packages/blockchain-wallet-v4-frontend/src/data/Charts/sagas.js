import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'
import { api } from 'services/ApiService'

const fetchPriceIndexSeries = function * (action) {
  try {
    const { coin, timeframe, start, scale } = action.payload
    const response = yield call(api.getPriceIndexSeries, coin, timeframe, start, scale)
    yield put(A.fetchPriceIndexSeriesSuccess(response))
  } catch (error) {
    yield put(A.fetchPriceIndexSeriesError(error))
  }
}

function * sagas () {
  yield takeEvery(T.FETCH_PRICE_INDEX_SERIES, fetchPriceIndexSeries)
}

export default sagas
