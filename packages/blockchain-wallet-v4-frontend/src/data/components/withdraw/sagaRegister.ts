import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const withdrawSagas = sagas({ api, coreSagas, networks })

  return function* custodialSaga() {
    yield takeLatest(actions.handleCustodyWithdraw.type, withdrawSagas.handleWithdrawSubmit)
    yield takeLatest(actions.showModal.type, withdrawSagas.showModal)
    yield takeLatest(
      actions.handleWithdrawMaxAmountClick.type,
      withdrawSagas.handleWithdrawMaxAmountClick
    )
    yield takeLatest(
      actions.handleWithdrawMinAmountClick.type,
      withdrawSagas.handleWithdrawMinAmountClick
    )
    yield takeLatest(actions.fetchWithdrawalFees.type, withdrawSagas.fetchFees)
    yield takeLatest(actions.fetchWithdrawalLock.type, withdrawSagas.fetchWithdrawLocks)
    yield takeLatest(actions.fetchCrossBorderLimits.type, withdrawSagas.fetchCrossBorderLimits)
  }
}
