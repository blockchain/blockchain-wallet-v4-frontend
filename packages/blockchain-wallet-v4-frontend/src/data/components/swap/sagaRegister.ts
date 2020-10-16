import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api }) => {
  const swapSagas = sagas({ api })

  return function * swapSaga () {
    yield takeLatest(AT.CHANGE_PAIR, swapSagas.changePair)
    yield takeLatest(AT.CREATE_ORDER, swapSagas.createOrder)
    yield takeLatest(AT.FETCH_QUOTE, swapSagas.fetchQuote)
    yield takeLatest(AT.SHOW_MODAL, swapSagas.showModal)
  }
}
