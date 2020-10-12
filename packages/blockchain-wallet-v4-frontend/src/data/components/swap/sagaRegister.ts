import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default () => {
  const swapSagas = sagas()

  return function * swapSaga () {
    yield takeLatest(AT.SHOW_MODAL, swapSagas.showModal)
  }
}
