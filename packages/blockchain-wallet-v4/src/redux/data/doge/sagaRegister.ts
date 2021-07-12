import { fork, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataDogeSagas = sagas({ api })

  return function* coreDataDogeSaga() {
    yield takeLatest(AT.FETCH_DOGE_RATES, dataDogeSagas.fetchRates)
    yield fork(dataDogeSagas.watchTransactions)
  }
}
