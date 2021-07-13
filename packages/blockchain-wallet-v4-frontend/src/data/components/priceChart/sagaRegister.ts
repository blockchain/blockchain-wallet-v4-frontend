import { takeEvery } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const priceChartSagas = sagas()

  return function * priceChartSaga() {
    yield takeEvery(AT.PRICE_CHART_INITIALIZED, priceChartSagas.initialized)
    yield takeEvery(AT.PRICE_CHART_COIN_CLICKED, priceChartSagas.coinClicked)
    yield takeEvery(AT.PRICE_CHART_TIME_CLICKED, priceChartSagas.timeClicked)
  }
}
