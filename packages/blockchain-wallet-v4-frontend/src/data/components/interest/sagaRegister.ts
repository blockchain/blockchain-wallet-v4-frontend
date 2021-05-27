import { actionTypes as formActionTypes } from 'redux-form'
import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { actionTypes } from 'data'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const interestSagas = sagas({ api, coreSagas, networks })

  return function* interestSaga() {
    yield takeLatest(AT.FETCH_INTEREST_BALANCE, interestSagas.fetchInterestBalance)
    yield takeLatest(AT.FETCH_INTEREST_ELIGIBLE, interestSagas.fetchInterestEligible)
    yield takeLatest(AT.FETCH_INTEREST_INSTRUMENTS, interestSagas.fetchInterestInstruments)
    yield takeLatest(AT.FETCH_INTEREST_LIMITS, interestSagas.fetchInterestLimits)
    yield takeLatest(AT.FETCH_INTEREST_PAYMENT_ACCOUNT, interestSagas.fetchInterestAccount)
    yield takeLatest(AT.FETCH_INTEREST_RATE, interestSagas.fetchInterestRate)
    yield takeLeading(AT.FETCH_INTEREST_TRANSACTIONS, interestSagas.fetchInterestTransactions)
    yield takeLatest(
      AT.FETCH_INTEREST_TRANSACTIONS_REPORT,
      interestSagas.fetchInterestTransactionsReport
    )
    yield takeLeading(AT.FETCH_INTEREST_TRANSACTIONS, interestSagas.fetchInterestTransactions)
    yield takeLatest(AT.INITIALIZE_DEPOSIT_FORM, interestSagas.initializeDepositForm)
    yield takeLatest(AT.INITIALIZE_WITHDRAWAL_FORM, interestSagas.initializeWithdrawalForm)
    yield takeLatest(AT.ROUTE_TO_TX_HASH, interestSagas.routeToTxHash)
    yield takeLatest(AT.SUBMIT_DEPOSIT_FORM, interestSagas.sendDeposit)
    yield takeLatest(AT.REQUEST_WITHDRAWAL, interestSagas.requestWithdrawal)
    yield takeLatest(AT.SHOW_INTEREST_MODAL, interestSagas.showInterestModal)
    yield takeEvery(formActionTypes.CHANGE, interestSagas.formChanged)
    yield takeLatest(
      [
        actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS,
        actionTypes.modules.profile.FETCH_USER_DATA_FAILURE,
        actionTypes.modules.profile.SET_API_TOKEN_FAILURE
      ],
      interestSagas.fetchInterestBalance
    )
    yield takeLatest(
      AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION,
      interestSagas.fetchShowInterestCardAfterTransaction
    )
    yield takeLatest(AT.STOP_SHOWING_INTEREST_MODAL, interestSagas.stopShowingInterestModal)
    yield takeLatest(AT.FETCH_EDD_STATUS, interestSagas.fetchEDDStatus)
    yield takeLatest(AT.FETCH_EDD_WITHDRAW_LIMITS, interestSagas.fetchEDDWithdrawLimits)
  }
}
