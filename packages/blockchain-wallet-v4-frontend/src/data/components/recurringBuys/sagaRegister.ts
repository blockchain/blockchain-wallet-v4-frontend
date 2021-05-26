import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const recurringBuysSagas = sagas()

  return function* swapSaga() {
    yield takeLatest(AT.SHOW_MODAL, recurringBuysSagas.showModal)
  }
}
