import { actionTypes as formActionTypes } from 'redux-form'
import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { actionTypes } from 'data'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const interestSagas = sagas({ api, coreSagas, networks })

  return function* interestSaga() {
    yield takeLatest(actions.fetchRewardsBalance.type, interestSagas.fetchRewardsBalance)
    yield takeLatest(
      actions.fetchActiveRewardsBalance.type,
      interestSagas.fetchActiveRewardsBalance
    )
    yield takeLatest(actions.fetchStakingBalance.type, interestSagas.fetchStakingBalance)
    yield takeLatest(actions.fetchInterestEligible.type, interestSagas.fetchInterestEligible)
    yield takeLatest(actions.fetchEarnInstruments.type, interestSagas.fetchEarnInstruments)
    yield takeLatest(actions.fetchInterestLimits.type, interestSagas.fetchInterestLimits)
    yield takeLatest(actions.fetchStakingLimits.type, interestSagas.fetchStakingLimits)
    yield takeLatest(actions.fetchActiveRewardsLimits.type, interestSagas.fetchActiveRewardsLimits)
    yield takeLatest(actions.fetchRewardsAccount.type, interestSagas.fetchRewardsAccount)
    yield takeLatest(actions.fetchStakingAccount.type, interestSagas.fetchStakingAccount)
    yield takeLatest(
      actions.fetchActiveRewardsAccount.type,
      interestSagas.fetchActiveRewardsAccount
    )
    yield takeLatest(actions.fetchInterestRates.type, interestSagas.fetchInterestRates)
    yield takeLatest(actions.fetchStakingRates.type, interestSagas.fetchStakingRates)
    yield takeLatest(actions.fetchActiveRewardsRates.type, interestSagas.fetchActiveRewardsRates)
    yield takeLatest(actions.fetchStakingEligible.type, interestSagas.fetchStakingEligible)
    yield takeLatest(actions.fetchStakingWithdrawals.type, interestSagas.fetchStakingWithdrawals)
    yield takeLatest(
      actions.fetchActiveRewardsEligible.type,
      interestSagas.fetchActiveRewardsEligible
    )
    yield takeLeading(actions.fetchEarnTransactions.type, interestSagas.fetchEarnTransactions)
    yield takeLeading(
      actions.fetchPendingActiveRewardsTransactions.type,
      interestSagas.fetchPendingActiveRewardsTransactions
    )
    yield takeLeading(
      actions.fetchPendingStakingTransactions.type,
      interestSagas.fetchPendingStakingTransactions
    )
    yield takeLatest(
      actions.fetchEarnTransactionsReport.type,
      interestSagas.fetchEarnTransactionsReport
    )
    yield takeLeading(actions.fetchEarnTransactions.type, interestSagas.fetchEarnTransactions)
    yield takeLatest(
      actions.initializeActiveRewardsDepositForm.type,
      interestSagas.initializeActiveRewardsDepositForm
    )
    yield takeLatest(
      actions.initializeInterestDepositForm.type,
      interestSagas.initializeInterestDepositForm
    )
    yield takeLatest(
      actions.initializeStakingDepositForm.type,
      interestSagas.initializeStakingDepositForm
    )
    yield takeLatest(actions.initializeWithdrawalForm.type, interestSagas.initializeWithdrawalForm)
    yield takeLatest(actions.routeToTxHash.type, interestSagas.routeToTxHash)
    yield takeLatest(actions.submitDepositForm.type, interestSagas.sendDeposit)
    yield takeLatest(
      actions.requestActiveRewardsWithdrawal.type,
      interestSagas.requestActiveRewardsWithdrawal
    )
    yield takeLatest(actions.requestStakingWithdrawal.type, interestSagas.requestStakingWithdrawal)
    yield takeLatest(actions.requestWithdrawal.type, interestSagas.requestWithdrawal)
    yield takeLatest(actions.showActiveRewardsModal.type, interestSagas.showActiveRewardsModal)
    yield takeLatest(actions.showInterestModal.type, interestSagas.showInterestModal)
    yield takeLatest(actions.showStakingModal.type, interestSagas.showStakingModal)
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
      interestSagas.fetchRewardsBalance
    )
    yield takeLatest(
      [
        actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS,
        actionTypes.modules.profile.FETCH_USER_DATA_FAILURE,
        actionTypes.modules.profile.SET_API_TOKEN_FAILURE
      ],
      interestSagas.fetchStakingBalance
    )
    yield takeLatest(
      [
        actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS,
        actionTypes.modules.profile.FETCH_USER_DATA_FAILURE,
        actionTypes.modules.profile.SET_API_TOKEN_FAILURE
      ],
      interestSagas.fetchActiveRewardsBalance
    )
    yield takeLatest(
      actions.fetchShowInterestCardAfterTransaction.type,
      interestSagas.fetchShowInterestCardAfterTransaction
    )
    yield takeLatest(actions.stopShowingInterestModal.type, interestSagas.stopShowingInterestModal)
    yield takeLatest(actions.fetchEDDStatus.type, interestSagas.fetchEDDStatus)
    yield takeLatest(actions.fetchEDDWithdrawLimits.type, interestSagas.fetchEDDWithdrawLimits)
    yield takeLatest(actions.fetchEDDDepositLimits.type, interestSagas.fetchEDDDepositLimits)
  }
}
