import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const interestSagas = sagas({ api, coreSagas, networks })

  return function * interestSaga () {
    yield takeLatest(
      AT.FETCH_INTEREST_BALANCE,
      interestSagas.fetchInterestBalance
    )
    yield takeLatest(
      AT.FETCH_INTEREST_ELIGIBLE,
      interestSagas.fetchInterestEligible
    )
    yield takeLatest(
      AT.FETCH_INTEREST_INSTRUMENTS,
      interestSagas.fetchInterestInstruments
    )
    yield takeLatest(
      AT.FETCH_INTEREST_LIMITS,
      interestSagas.fetchInterestLimits
    )
    yield takeLatest(
      AT.FETCH_INTEREST_PAYMENT_ACCOUNT,
      interestSagas.fetchInterestPaymentAccount
    )
    yield takeLatest(AT.FETCH_INTEREST_RATE, interestSagas.fetchInterestRate)
    yield takeLatest(
      AT.FETCH_INTEREST_TRANSACTIONS,
      interestSagas.fetchInterestTransactions
    )
    yield takeLatest(
      AT.INITIALIZE_SUMMARY_CARD,
      interestSagas.intitalizeSummaryCard
    )

    yield takeLatest(AT.INITIALIZE_INTEREST, interestSagas.initializeInterest)
    yield takeLatest(AT.SHOW_INTEREST_MODAL, interestSagas.showInterestModal)
  }
}
