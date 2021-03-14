import { fork, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataDotSagas = sagas({ api })

  return function * coreDataDotSaga() {
    yield takeLatest(AT.FETCH_DOT_RATES, dataDotSagas.fetchRates)
    yield fork(dataDotSagas.watchTransactions)
  }
}
