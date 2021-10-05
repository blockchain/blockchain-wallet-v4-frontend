import { takeEvery } from 'redux-saga/effects'

import sagas from './sagas'
import { coinClicked, initialized, timeClicked } from './slice'

export default () => {
  const priceChartSagas = sagas()

  return function* priceChartSaga() {
    yield takeEvery(initialized.type, priceChartSagas.initialized)
    yield takeEvery(coinClicked.type, priceChartSagas.coinClicked)
    yield takeEvery(timeClicked.type, priceChartSagas.timeClicked)
  }
}
