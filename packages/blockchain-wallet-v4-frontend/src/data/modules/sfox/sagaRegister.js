import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const sfoxSagas = sagas({ api, coreSagas, networks })

  return function* sfoxSaga () {
    yield takeLatest(AT.SET_BANK_MANUALLY, sfoxSagas.setBankManually)
    yield takeLatest(AT.SET_BANK, sfoxSagas.setBank)
    yield takeLatest(AT.SFOX_SIGNUP, sfoxSagas.sfoxSignup)
    yield takeLatest(AT.SET_PROFILE, sfoxSagas.setProfile)
    yield takeLatest(AT.UPLOAD, sfoxSagas.upload)
    yield takeLatest(AT.SUBMIT_MICRO_DEPOSITS, sfoxSagas.submitMicroDeposits)
    yield takeLatest(AT.SUBMIT_QUOTE, sfoxSagas.submitQuote)
    yield takeLatest(AT.SUBMIT_SELL_QUOTE, sfoxSagas.submitSellQuote)
    yield takeLatest(AT.HANDLE_MODAL_CLOSE, sfoxSagas.checkProfileStatus)
    yield takeLatest(AT.SFOX_INITIALIZE_PAYMENT, sfoxSagas.initializePayment)
    yield takeLatest(AT.INITIALIZE_JUMIO, sfoxSagas.initializeJumio)
    yield takeLatest(AT.FETCH_JUMIO_STATUS, sfoxSagas.fetchJumioStatus)
    yield takeLatest(AT.FETCH_JUMIO_TOKEN, sfoxSagas.fetchJumioToken)
    yield takeLatest(AT.COMPLETE_JUMIO, sfoxSagas.completeJumio)
    yield takeLatest(AT.SFOX_INITIALIZE, sfoxSagas.sfoxInitialize)
  }
}
