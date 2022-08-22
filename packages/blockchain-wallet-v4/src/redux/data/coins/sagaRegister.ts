import { fork, takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const dataCoinsSagas = sagas({ api })

  return function* coreDataCoinsSaga() {
    yield takeLatest(actions.fetchCoinsRates.type, dataCoinsSagas.fetchCoinsRates)
    yield takeLatest(actions.pollForCoinData.type, dataCoinsSagas.pollForCoinData)
    yield fork(dataCoinsSagas.watchTransactions)
  }
}
