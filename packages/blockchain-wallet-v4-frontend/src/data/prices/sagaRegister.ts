import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const pricesSagas = sagas({ api })

  return function * pricesSaga() {
    yield takeLatest(AT.FETCH_COIN_PRICES, pricesSagas.fetchCoinPrices)
    yield takeLatest(
      AT.FETCH_COIN_PRICES_PREVIOUS_DAY,
      pricesSagas.fetchCoinPricesPreviousDay
    )
  }
}
