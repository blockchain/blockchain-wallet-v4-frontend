import { fork, takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const dataCoinsSagas = sagas({ api })

  return function* coreDataCoinsSaga() {
    yield takeLatest(actions.fetchCoinsRates.type, dataCoinsSagas.fetchCoinsRates)
    yield takeLatest(actions.pollForCoinData.type, dataCoinsSagas.pollForCoinData)
    yield takeLatest(actions.fetchUnifiedBalances.type, dataCoinsSagas.fetchUnifiedBalances)
    yield takeLatest(actions.fetchTransactionHistory.type, dataCoinsSagas.fetchTransactionHistory)
    yield takeLatest(actions.initializeSubscriptions.type, dataCoinsSagas.initializeSubscriptions)
    yield takeLatest(actions.unsubscribe.type, dataCoinsSagas.unsubscribe)
    yield takeLatest(actions.subscribe.type, dataCoinsSagas.subscribe)
    yield fork(dataCoinsSagas.watchTransactions)
  }
}
