import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api }) => {
  const withdrawSagas = sagas({ api })

  return function * custodialSaga () {
    yield takeLatest(
      AT.HANDLE_WITHDRAW_SUBMIT,
      withdrawSagas.handleWithdrawSubmit
    )
    yield takeLatest(AT.SHOW_MODAL, withdrawSagas.showModal)
  }
}
