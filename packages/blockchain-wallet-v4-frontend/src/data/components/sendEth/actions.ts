import { CoinType, CrossBorderLimits, WalletAcountType, WalletFiatType } from '@core/types'

import * as AT from './actionTypes'

export const initialized = (payload) => ({
  payload,
  type: AT.SEND_ETH_INITIALIZED
})
export const destroyed = () => ({ type: AT.SEND_ETH_DESTROYED })
export const retrySendEth = (txHash: string, isErc20: boolean) => ({
  payload: { isErc20, txHash },
  type: AT.RETRY_SEND_ETH
})
export const sendEthPaymentUpdatedLoading = () => ({
  type: AT.SEND_ETH_PAYMENT_UPDATED_LOADING
})
export const sendEthPaymentUpdatedSuccess = (payment) => ({
  payload: payment,
  type: AT.SEND_ETH_PAYMENT_UPDATED_SUCCESS
})
export const sendEthPaymentUpdatedFailure = (e) => ({
  payload: e,
  type: AT.SEND_ETH_PAYMENT_UPDATED_FAILURE
})
export const sendEthFirstStepMaximumAmountClicked = (coinCode) => ({
  payload: coinCode,
  type: AT.SEND_ETH_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED
})
export const sendEthFirstStepSubmitClicked = () => ({
  type: AT.SEND_ETH_FIRST_STEP_SUBMIT_CLICKED
})
export const sendEthSecondStepSubmitClicked = () => ({
  type: AT.SEND_ETH_SECOND_STEP_SUBMIT_CLICKED
})
export const sendEthSecondStepCancelClicked = () => ({
  type: AT.SEND_ETH_SECOND_STEP_CANCEL_CLICKED
})
export const sendEthFirstStepFeeToggled = () => ({
  type: AT.SEND_ETH_FIRST_STEP_FEE_TOGGLED
})
export const sendEthCheckIsContract = (address) => ({
  payload: address,
  type: AT.SEND_ETH_CHECK_IS_CONTRACT
})
export const sendEthCheckIsContractLoading = () => ({
  type: AT.SEND_ETH_CHECK_IS_CONTRACT_LOADING
})
export const sendEthCheckIsContractSuccess = (isContract) => ({
  payload: isContract,
  type: AT.SEND_ETH_CHECK_IS_CONTRACT_SUCCESS
})
export const sendEthCheckIsContractFailure = (e) => ({
  payload: e,
  type: AT.SEND_ETH_CHECK_IS_CONTRACT_FAILURE
})
export const sendEthFirstStepRegularFeeClicked = () => ({
  type: AT.SEND_ETH_FIRST_STEP_REGULAR_FEE_CLICKED
})
export const sendEthFirstStepPriorityFeeClicked = () => ({
  type: AT.SEND_ETH_FIRST_STEP_PRIORITY_FEE_CLICKED
})
export const sendEthFirstStepMinimumFeeClicked = () => ({
  type: AT.SEND_ETH_FIRST_STEP_MINIMUM_FEE_CLICKED
})
export const sendEthFirstStepMaximumFeeClicked = () => ({
  type: AT.SEND_ETH_FIRST_STEP_MAXIMUM_FEE_CLICKED
})

export const sendEthFetchLimits = (
  inputCurrency: CoinType,
  fromAccount: WalletAcountType,
  outputCurrency: CoinType,
  toAccount: WalletAcountType,
  currency?: WalletFiatType
) => ({
  payload: {
    currency,
    fromAccount,
    inputCurrency,
    outputCurrency,
    toAccount
  },
  type: AT.SEND_ETH_FETCH_LIMITS
})
export const sendEthFetchLimitsFailure = (error: string) => ({
  payload: {
    error
  },
  type: AT.SEND_ETH_FETCH_LIMITS_FAILURE
})
export const sendEthFetchLimitsLoading = () => ({
  type: AT.SEND_ETH_FETCH_LIMITS_LOADING
})
export const sendEthFetchLimitsSuccess = (limitsResponse: CrossBorderLimits) => ({
  payload: limitsResponse,
  type: AT.SEND_ETH_FETCH_LIMITS_SUCCESS
})
