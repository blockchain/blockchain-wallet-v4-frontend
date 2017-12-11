import { call, put, select, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions'
import * as sagas from '../../sagas'
import * as selectors from '../../selectors'
import { selectPriceIndexSeriesOptions } from 'services/ChartService'

export const init = function * (action) {
  try {
    const { coin, timeframe } = action.payload
    const currency = yield select(selectors.core.settings.getCurrency)
    const { start, scale, interval } = selectPriceIndexSeriesOptions(coin, timeframe)
    yield call(sagas.core.data.misc.fetchPriceIndexSeries, { coin, currency, start, scale })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init chart.'))
  }
}

export const refresh = function * (action) {
  try {
    const { coin, timeframe } = action.payload
    const currency = yield select(selectors.core.settings.getCurrency)
    const { start, scale, interval } = selectPriceIndexSeriesOptions(coin, timeframe)
    yield call(sagas.core.data.misc.fetchPriceIndexSeries, { coin, currency, start, scale })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not refresh chart.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_CHART, init)
  yield takeEvery(AT.REFRESH_CHART, refresh)
}
