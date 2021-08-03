import { fork, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataCoinsSagas = sagas({ api })

  return function* coreDataCoinsSaga() {
    yield takeLatest(AT.FETCH_COINS_RATES, dataCoinsSagas.fetchCoinsRates)
    yield fork(dataCoinsSagas.watchTransactions)
  }
}
