import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api }) => {
  const dataAlgoSagas = sagas({ api })

  return function * coreDataAlgoSaga () {
    yield takeLatest(AT.FETCH_ALGO_RATES, dataAlgoSagas.fetchRates)
  }
}
