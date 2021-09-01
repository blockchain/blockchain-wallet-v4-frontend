import { actionTypes as formActionTypes } from 'redux-form'
import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { actionTypes } from 'data'

import sagas from './sagas'
import { actions, fetchInterestLimits } from './slice'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const interestSagas = sagas({ api, coreSagas, networks })

  return function* interestSaga() {
    yield takeLatest(actions.fetchInterestBalance.type, interestSagas.fetchInterestBalance)
    yield takeLatest(actions.fetchInterestEligible.type, interestSagas.fetchInterestEligible)
    yield takeLatest(actions.fetchInterestInstruments.type, interestSagas.fetchInterestInstruments)
    yield takeLatest(fetchInterestLimits.type, interestSagas.fetchInterestLimits)
    yield takeLatest(actions.fetchInterestAccount.type, interestSagas.fetchInterestAccount)
    yield takeLatest(actions.fetchInterestRate.type, interestSagas.fetchInterestRate)
    yield takeLeading(
      actions.fetchInterestTransactions.type,
      interestSagas.fetchInterestTransactions
    )
    yield takeLatest(
      actions.fetchInterestTransactionsReport.type,
      interestSagas.fetchInterestTransactionsReport
    )
    yield takeLeading(
      actions.fetchInterestTransactions.type,
      interestSagas.fetchInterestTransactions
    )
    yield takeLatest(actions.initializeDepositForm.type, interestSagas.initializeDepositForm)
    yield takeLatest(actions.initializeWithdrawalForm.type, interestSagas.initializeWithdrawalForm)
    yield takeLatest(actions.routeToTxHash.type, interestSagas.routeToTxHash)
    yield takeLatest(actions.submitDepositForm.type, interestSagas.sendDeposit)
    yield takeLatest(actions.requestWithdrawal.type, interestSagas.requestWithdrawal)
    yield takeLatest(actions.showInterestModal.type, interestSagas.showInterestModal)
    yield takeLatest(
      actions.handleTransferMaxAmountClick.type,
      interestSagas.handleTransferMaxAmountClick
    )
    yield takeLatest(
      actions.handleTransferMinAmountClick.type,
      interestSagas.handleTransferMinAmountClick
    )

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
      actions.fetchShowInterestCardAfterTransaction.type,
      interestSagas.fetchShowInterestCardAfterTransaction
    )
    yield takeLatest(actions.stopShowingInterestModal.type, interestSagas.stopShowingInterestModal)
    yield takeLatest(actions.fetchEDDStatus.type, interestSagas.fetchEDDStatus)
    yield takeLatest(actions.fetchEDDWithdrawLimits.type, interestSagas.fetchEDDWithdrawLimits)
  }
}
