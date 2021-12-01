import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const withdrawSagas = sagas({ api })

  return function* custodialSaga() {
    // yield takeLatest(AT.HANDLE_WITHDRAW_SUBMIT, withdrawSagas.handleWithdrawSubmit)
    yield takeLatest(actions.handleCustodyWithdraw.type, withdrawSagas.handleWithdrawSubmit)
    // yield takeLatest(AT.SHOW_MODAL, withdrawSagas.showModal)
    yield takeLatest(actions.showModal.type, withdrawSagas.showModal)
    // yield takeLatest(
    //   AT.HANDLE_WITHDRAWAL_MAX_AMOUNT_CLICK,
    //   withdrawSagas.handleWithdrawMaxAmountClick
    // )
    yield takeLatest(
      actions.handleWithdrawMaxAmountClick.type,
      withdrawSagas.handleWithdrawMaxAmountClick
    )
    // yield takeLatest(
    //   AT.HANDLE_WITHDRAWAL_MIN_AMOUNT_CLICK,
    //   withdrawSagas.handleWithdrawMinAmountClick
    // )
    yield takeLatest(
      actions.handleWithdrawMinAmountClick.type,
      withdrawSagas.handleWithdrawMinAmountClick
    )
    // yield takeLatest(AT.FETCH_WITHDRAWAL_FEES, withdrawSagas.fetchFees)
    yield takeLatest(actions.fetchWithdrawalFees.type, withdrawSagas.fetchFees)
    // yield takeLatest(AT.FETCH_WITHDRAWAL_LOCK, withdrawSagas.fetchWithdrawLocks)
    yield takeLatest(actions.fetchWithdrawalLock.type, withdrawSagas.fetchWithdrawLocks)
    // yield takeLatest(AT.FETCH_WITHDRAWAL_CROSSBORDER_LIMITS, withdrawSagas.fetchCrossBorderLimits)
    yield takeLatest(actions.fetchCrossBorderLimits.type, withdrawSagas.fetchCrossBorderLimits)
  }
}
