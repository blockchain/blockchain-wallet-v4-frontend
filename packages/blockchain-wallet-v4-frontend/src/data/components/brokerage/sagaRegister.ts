import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const brokerageSagas = sagas({ api })

  return function* brokerageSaga() {
    yield takeLatest(
      actions.fetchBankTransferAccounts.type,
      brokerageSagas.fetchBankTransferAccounts
    )
    yield takeLatest(actions.fetchBankTransferUpdate.type, brokerageSagas.fetchBankTransferUpdate)
    yield takeLatest(actions.handleDepositFiatClick.type, brokerageSagas.handleDepositFiatClick)
    yield takeLatest(actions.handleWithdrawClick.type, brokerageSagas.handleWithdrawClick)
    yield takeLatest(actions.createFiatDeposit.type, brokerageSagas.createFiatDeposit)
    yield takeLatest(actions.deleteSavedBank.type, brokerageSagas.deleteSavedBank)
    yield takeLatest(actions.fetchBankLinkCredentials.type, brokerageSagas.fetchBankLinkCredentials)
    yield takeLatest(actions.showModal.type, brokerageSagas.showModal)
  }
}
