import * as AT from './actionTypes'
import {
  takeLatest
} from 'redux-saga/effects'
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
    yield takeLatest(AT.DELETE_SAVED_BANK, brokerageSagas.deleteSavedBank)
    yield takeLatest(AT.FETCH_FAST_LINK, brokerageSagas.fetchFastLink)
  }
}
