import { fork, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataCoinsSagas = sagas({ api })

  return function* coreDataCoinsSaga() {
    yield takeLatest(AT.FETCH_COIN_DATA, dataCoinsSagas.fetchCoinData)
    yield takeLatest(AT.FETCH_COINS_RATES, dataCoinsSagas.fetchCoinsRates)
    yield takeLatest(AT.POLL_FOR_COIN_DATA, dataCoinsSagas.pollForCoinData)
    yield fork(dataCoinsSagas.watchTransactions)
  }
}
