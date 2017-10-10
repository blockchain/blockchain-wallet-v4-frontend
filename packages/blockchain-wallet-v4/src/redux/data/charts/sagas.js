import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const chartsSaga = ({ api } = {}) => {
  const fetchPriceIndexSeries = function * ({ coin, currency, start, scale }) {
    const response = yield call(api.getPriceIndexSeries, coin, currency, start, scale)
    yield put(A.setPriceIndexSeries(response))
  }

  return {
    fetchPriceIndexSeries
  }
}
