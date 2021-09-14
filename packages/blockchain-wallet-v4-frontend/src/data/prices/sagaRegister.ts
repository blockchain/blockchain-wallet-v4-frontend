import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { fetchCoinPrices, fetchCoinPricesPreviousDay } from './slice'

export default ({ api }) => {
  const pricesSagas = sagas({ api })

  return function* pricesSaga() {
    yield takeLatest(fetchCoinPrices.type, pricesSagas.fetchCoinPrices)
    yield takeLatest(fetchCoinPricesPreviousDay.type, pricesSagas.fetchCoinPricesPreviousDay)
  }
}
