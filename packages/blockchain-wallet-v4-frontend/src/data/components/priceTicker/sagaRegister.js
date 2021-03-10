import { takeEvery } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const priceTickerSagas = sagas({ coreSagas })

  return function * priceTickerSaga() {
    yield takeEvery(AT.PRICE_TICKER_INITIALIZED, priceTickerSagas.initialized)
  }
}
