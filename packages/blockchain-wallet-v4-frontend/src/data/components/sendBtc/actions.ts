import {
  CoinType,
  CrossBorderLimits,
  PaymentValue,
  WalletAccountType,
  WalletFiatType
} from '@core/types'

import * as AT from './actionTypes'
import { ImportedBtcAddressList } from './types'

export const initialized = (payload) => ({
  payload,
  type: AT.SEND_BTC_INITIALIZED
})

export const destroyed = () => ({ type: AT.SEND_BTC_DESTROYED })

export const btcImportedFundsSweep = (importedAddress: string[]) => ({
  payload: importedAddress,
  type: AT.SEND_BTC_IMPORTED_FUNDS_SWEEP
})

export const btcImportedFundsSweepFailure = (payload) => ({
  payload,
  type: AT.SEND_BTC_IMPORTED_FUNDS_SWEEP_FAILURE
})

export const btcImportedFundsSweepLoading = () => ({
  type: AT.SEND_BTC_IMPORTED_FUNDS_SWEEP_LOADING
})

export const btcImportedFundsSweepSuccess = (payload) => ({
  payload,
  type: AT.SEND_BTC_IMPORTED_FUNDS_SWEEP_SUCCESS
})

export const setImportFundsReceiveIndex = (index: number | null) => ({
  payload: index,
  type: AT.SET_IMPORT_FUNDS_RECEIVE_INDEX
})

export const btcImportedFundsSweepEffectiveBalance = () => ({
  type: AT.SEND_BTC_IMPORTED_FUNDS_SWEEP_EFFECTIVE_BALANCE
})

export const btcImportedFundsSweepEffectiveBalanceLoading = () => ({
  type: AT.SEND_BTC_IMPORTED_FUNDS_SWEEP_EFFECTIVE_BALANCE_LOADING
})

export const btcImportedFundsSweepEffectiveBalanceSuccess = (payload: ImportedBtcAddressList) => ({
  payload,
  type: AT.SEND_BTC_IMPORTED_FUNDS_SWEEP_EFFECTIVE_BALANCE_SUCCESS
})

export const btcImportedFundsSweepEffectiveBalanceFailure = (error) => ({
  payload: error,
  type: AT.SEND_BTC_IMPORTED_FUNDS_SWEEP_EFFECTIVE_BALANCE_FAILURE
})

export const sendBtcPaymentUpdatedSuccess = (payment: PaymentValue) => ({
  payload: payment,
  type: AT.SEND_BTC_PAYMENT_UPDATED_SUCCESS
})
export const sendBtcPaymentUpdatedLoading = () => ({
  type: AT.SEND_BTC_PAYMENT_UPDATED_LOADING
})
export const sendBtcPaymentUpdatedFailure = (err) => ({
  payload: err,
  type: AT.SEND_BTC_PAYMENT_UPDATED_FAILURE
})

export const clearSendBtcMaxCustodialWithdrawalFee = () => ({
  type: AT.CLEAR_SEND_BTC_MAX_CUSTODIAL_WITHDRAWAL_FEE
})

export const sendBtcFetchMaxCustodialWithdrawalFeeSuccess = (fee: string) => ({
  payload: fee,
  type: AT.SEND_BTC_FETCH_MAX_CUSTODIAL_WITHDRAWAL_FEE_SUCCESS
})
export const sendBtcFetchMaxCustodialWithdrawalFeeLoading = () => ({
  type: AT.SEND_BTC_FETCH_MAX_CUSTODIAL_WITHDRAWAL_FEE_LOADING
})
export const sendBtcFetchMaxCustodialWithdrawalFeeFailure = (err) => ({
  payload: err,
  type: AT.SEND_BTC_FETCH_MAX_CUSTODIAL_WITHDRAWAL_FEE_FAILURE
})

export const sendBtcFirstStepFeePerByteToggled = () => ({
  type: AT.SEND_BTC_FIRST_STEP_FEEPERBYTE_TOGGLED
})

export const sendBtcFirstStepMinimumAmountClicked = () => ({
  type: AT.SEND_BTC_FIRST_STEP_MINIMUM_AMOUNT_CLICKED
})

export const sendBtcFirstStepMaximumAmountClicked = () => ({
  type: AT.SEND_BTC_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED
})

export const sendBtcFirstStepMinimumFeeClicked = () => ({
  type: AT.SEND_BTC_FIRST_STEP_MINIMUM_FEE_CLICKED
})

export const sendBtcFirstStepMaximumFeeClicked = () => ({
  type: AT.SEND_BTC_FIRST_STEP_MAXIMUM_FEE_CLICKED
})

export const sendBtcFirstStepRegularFeeClicked = () => ({
  type: AT.SEND_BTC_FIRST_STEP_REGULAR_FEE_CLICKED
})

export const sendBtcFirstStepPriorityFeeClicked = () => ({
  type: AT.SEND_BTC_FIRST_STEP_PRIORITY_FEE_CLICKED
})

export const sendBtcFirstStepSubmitClicked = () => ({
  type: AT.SEND_BTC_FIRST_STEP_SUBMIT_CLICKED
})

export const sendBtcSecondStepSubmitClicked = () => ({
  type: AT.SEND_BTC_SECOND_STEP_SUBMIT_CLICKED
})

export const sendBtcSecondStepCancelClicked = () => ({
  type: AT.SEND_BTC_SECOND_STEP_CANCEL_CLICKED
})

export const sendBtcBitPayInvoiceExpired = () => ({
  type: AT.SEND_BTC_BITPAY_INVOICE_EXPIRED
})

export const sendBtcFetchLimits = (
  inputCurrency: CoinType,
  fromAccount: WalletAccountType,
  outputCurrency: CoinType,
  toAccount: WalletAccountType,
  currency?: WalletFiatType
) => ({
  payload: {
    currency,
    fromAccount,
    inputCurrency,
    outputCurrency,
    toAccount
  },
  type: AT.SEND_BTC_FETCH_LIMITS
})
export const sendBtcFetchLimitsFailure = (error: string) => ({
  payload: {
    error
  },
  type: AT.SEND_BTC_FETCH_LIMITS_FAILURE
})
export const sendBtcFetchLimitsLoading = () => ({
  type: AT.SEND_BTC_FETCH_LIMITS_LOADING
})
export const sendBtcFetchLimitsSuccess = (limitsResponse: CrossBorderLimits) => ({
  payload: limitsResponse,
  type: AT.SEND_BTC_FETCH_LIMITS_SUCCESS
})
