import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'
import * as AT from './actionTypes'

export const chartsSaga = ({ api } = {}) => {
  const fetchPriceIndexSeries = function * (action) {

    try {
      const { coin, timeframe, start, scale } = action.payload
      const response = yield call(api.getPriceIndexSeries, coin, timeframe, start, scale)
      yield put(A.fetchPriceIndexSeriesSuccess(response))
    } catch (error) {
      yield put(A.fetchPriceIndexSeriesError(error))
    }
  }

  return function * () {
    yield takeEvery(AT.FETCH_PRICE_INDEX_SERIES, fetchPriceIndexSeries)
  }
}
