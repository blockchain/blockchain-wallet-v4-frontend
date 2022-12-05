import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const brokerageSagas = sagas({ api, coreSagas, networks })

  return function* brokerageSaga() {
    yield takeLatest(
      actions.fetchBankTransferAccounts.type,
      brokerageSagas.fetchBankTransferAccounts
    )
    yield takeLatest(actions.fetchDepositTerms.type, brokerageSagas.fetchDepositTerms)
    yield takeLatest(actions.fetchBankTransferUpdate.type, brokerageSagas.fetchBankTransferUpdate)
    yield takeLatest(actions.handleDepositFiatClick.type, brokerageSagas.handleDepositFiatClick)
    yield takeLatest(actions.handleWithdrawClick.type, brokerageSagas.handleWithdrawClick)
    yield takeLatest(actions.createFiatDeposit.type, brokerageSagas.createFiatDeposit)
    yield takeLatest(actions.deleteSavedBank.type, brokerageSagas.deleteSavedBank)
    yield takeLatest(actions.fetchBankLinkCredentials.type, brokerageSagas.fetchBankLinkCredentials)
    yield takeLatest(
      actions.setupBankTransferProvider.type,
      brokerageSagas.setupBankTransferProvider
    )
    yield takeLatest(actions.paymentAccountCheck.type, brokerageSagas.paymentAccountCheck)
    yield takeLatest(
      actions.fetchBankRefreshCredentials.type,
      brokerageSagas.fetchBankRefreshCredentials
    )
    yield takeLatest(actions.showModal.type, brokerageSagas.showModal)
    yield takeLatest(actions.fetchCrossBorderLimits.type, brokerageSagas.fetchCrossBorderLimits)
  }
}
