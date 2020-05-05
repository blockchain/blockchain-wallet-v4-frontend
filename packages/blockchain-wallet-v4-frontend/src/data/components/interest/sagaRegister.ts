import * as AT from './actionTypes'
import { APIType } from 'core/network/api'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
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
      interestSagas.fetchInterestAccount
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
    yield takeLatest(
      AT.INITIALIZE_WITHDRAWAL_FORM,
      interestSagas.initializeWithdrawalForm
    )
    yield takeLatest(AT.ROUTE_TO_TX_HASH, interestSagas.routeToTxHash)
    yield takeLatest(AT.SUBMIT_DEPOSIT_FORM, interestSagas.sendDeposit)
    yield takeLatest(AT.REQUEST_WITHDRAWAL, interestSagas.requestWithdrawal)
    yield takeLatest(AT.SHOW_INTEREST_MODAL, interestSagas.showInterestModal)
  }
}
