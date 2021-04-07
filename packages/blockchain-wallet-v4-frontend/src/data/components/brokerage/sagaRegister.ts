import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const brokerageSagas = sagas({ api, coreSagas, networks })

  return function * brokerageSaga() {
    yield takeLatest(
      AT.FETCH_BANK_TRANSFER_ACCOUNTS,
      brokerageSagas.fetchBankTransferAccounts
    )
    yield takeLatest(
      AT.FETCH_BANK_TRANSFER_UPDATE,
      brokerageSagas.fetchBankTransferUpdate
    )
    yield takeLatest(
      AT.HANDLE_DEPOSIT_FIAT_CLICK,
      brokerageSagas.handleDepositFiatClick
    )
    yield takeLatest(AT.CREATE_FIAT_DEPOSIT, brokerageSagas.createFiatDeposit)

    yield takeLatest(AT.DELETE_SAVED_BANK, brokerageSagas.deleteSavedBank)
    yield takeLatest(
      AT.FETCH_BANK_LINK_CREDENTIALS,
      brokerageSagas.fetchBankLinkCredentials
    )
    yield takeLatest(AT.SHOW_MODAL, brokerageSagas.showModal)
  }
}
