import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const sfoxSagas = sagas({ coreSagas })

  return function * () {
    yield takeLatest(AT.SET_BANK_MANUALLY, sfoxSagas.setBankManually)
    yield takeLatest(AT.SET_BANK, sfoxSagas.setBank)
    yield takeLatest(AT.SFOX_SIGNUP, sfoxSagas.sfoxSignup)
    yield takeLatest(AT.SET_PROFILE, sfoxSagas.setProfile)
    yield takeLatest(AT.UPLOAD, sfoxSagas.upload)
    yield takeLatest(AT.SUBMIT_MICRO_DEPOSITS, sfoxSagas.submitMicroDeposits)
    yield takeLatest(AT.SUBMIT_QUOTE, sfoxSagas.submitQuote)
    yield takeLatest(AT.SUBMIT_SELL_QUOTE, sfoxSagas.submitSellQuote)
  }
}
