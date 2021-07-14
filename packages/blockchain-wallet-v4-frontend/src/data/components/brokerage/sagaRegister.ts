import { takeLatest } from 'redux-saga/effects'

import {
  createFiatDeposit,
  handleDepositFiatClick,
  deleteSavedBank,
  handleWithdrawClick,
  fetchBankTransferUpdate,
  fetchBankTransferAccounts,
  fetchBankLinkCredentials,
  fetchRBMethods,
  showModal
} from './slice'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const brokerageSagas = sagas({ api, coreSagas, networks })

  return function* brokerageSaga() {
    yield takeLatest(fetchBankTransferAccounts.type, brokerageSagas.fetchBankTransferAccounts)
    yield takeLatest(fetchBankTransferUpdate.type, brokerageSagas.fetchBankTransferUpdate)
    yield takeLatest(handleDepositFiatClick.type, brokerageSagas.handleDepositFiatClick)
    yield takeLatest(handleWithdrawClick.type, brokerageSagas.handleWithdrawClick)
    yield takeLatest(createFiatDeposit.type, brokerageSagas.createFiatDeposit)
    yield takeLatest(deleteSavedBank.type, brokerageSagas.deleteSavedBank)
    yield takeLatest(fetchBankLinkCredentials.type, brokerageSagas.fetchBankLinkCredentials)
    yield takeLatest(fetchRBMethods.type, brokerageSagas.fetchRBMethods)
    yield takeLatest(showModal.type, brokerageSagas.showModal)
  }
}
