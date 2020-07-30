import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default () => {
  const withdrawSagas = sagas()

  return function * custodialSaga () {
    yield takeLatest(AT.SHOW_MODAL, withdrawSagas.showModal)
  }
}
