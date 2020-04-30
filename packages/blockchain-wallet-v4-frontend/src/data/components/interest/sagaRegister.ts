import * as AT from './actionTypes'
import { APIType } from 'core/network/api'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api }: { api: APIType }) => {
  const interestSagas = sagas({ api })

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
      AT.INITIALIZE_DEPOSIT_FORM,
      interestSagas.initializeDepositForm
    )
    yield takeLatest(AT.SHOW_INTEREST_MODAL, interestSagas.showInterestModal)
  }
}
