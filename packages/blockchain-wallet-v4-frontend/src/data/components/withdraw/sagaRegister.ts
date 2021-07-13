import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const withdrawSagas = sagas({ api })

  return function* custodialSaga() {
    yield takeLatest(AT.HANDLE_WITHDRAW_SUBMIT, withdrawSagas.handleWithdrawSubmit)
    yield takeLatest(AT.SHOW_MODAL, withdrawSagas.showModal)
    yield takeLatest(
      AT.HANDLE_WITHDRAWAL_MAX_AMOUNT_CLICK,
      withdrawSagas.handleWithdrawMaxAmountClick
    )
    yield takeLatest(
      AT.HANDLE_WITHDRAWAL_MIN_AMOUNT_CLICK,
      withdrawSagas.handleWithdrawMinAmountClick
    )
    yield takeLatest(AT.FETCH_WITHDRAWAL_FEES, withdrawSagas.fetchFees)
    yield takeLatest(AT.FETCH_WITHDRAWAL_LOCK, withdrawSagas.fetchWithdrawLocks)
  }
}
