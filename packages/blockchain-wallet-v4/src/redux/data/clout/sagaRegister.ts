import { fork, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataCloutSagas = sagas({ api })

  return function* coreDataCloutSaga() {
    yield takeLatest(AT.FETCH_CLOUT_RATES, dataCloutSagas.fetchRates)
    yield fork(dataCloutSagas.watchTransactions)
  }
}
