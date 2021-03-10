import { fork, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataAlgoSagas = sagas({ api })

  return function * coreDataAlgoSaga() {
    yield takeLatest(AT.FETCH_ALGO_RATES, dataAlgoSagas.fetchRates)
    yield fork(dataAlgoSagas.watchTransactions)
  }
}
