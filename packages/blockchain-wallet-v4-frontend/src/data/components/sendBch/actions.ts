import { CoinType, CrossBorderLimits, WalletAcountType, WalletFiatType } from '@core/types'

import * as AT from './actionTypes'

export const initialized = (payload) => ({
  payload,
  type: AT.SEND_BCH_INITIALIZED
})
export const destroyed = () => ({ type: AT.SEND_BCH_DESTROYED })
export const sendBchPaymentUpdatedLoading = () => ({
  type: AT.SEND_BCH_PAYMENT_UPDATED_LOADING
})
export const sendBchPaymentUpdatedSuccess = (payment) => ({
  payload: payment,
  type: AT.SEND_BCH_PAYMENT_UPDATED_SUCCESS
})
export const sendBchPaymentUpdatedFailure = (e) => ({
  payload: e,
  type: AT.SEND_BCH_PAYMENT_UPDATED_FAILURE
})
export const sendBchFirstStepMaximumAmountClicked = () => ({
  type: AT.SEND_BCH_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED
})
export const sendBchFirstStepSubmitClicked = () => ({
  type: AT.SEND_BCH_FIRST_STEP_SUBMIT_CLICKED
})
export const sendBchSecondStepInitialized = () => ({
  type: AT.SEND_BCH_SECOND_STEP_INITIALIZED
})
export const sendBchSecondStepSubmitClicked = () => ({
  type: AT.SEND_BCH_SECOND_STEP_SUBMIT_CLICKED
})
export const sendBchSecondStepCancelClicked = () => ({
  type: AT.SEND_BCH_SECOND_STEP_CANCEL_CLICKED
})
export const sendBchBitPayInvoiceExpired = () => ({
  type: AT.SEND_BCH_BITPAY_INVOICE_EXPIRED
})

export const sendBchFetchLimits = (
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
  type: AT.SEND_BCH_FETCH_LIMITS
})
export const sendBchFetchLimitsFailure = (error: string) => ({
  payload: {
    error
  },
  type: AT.SEND_BCH_FETCH_LIMITS_FAILURE
})
export const sendBchFetchLimitsLoading = () => ({
  type: AT.SEND_BCH_FETCH_LIMITS_LOADING
})
export const sendBchFetchLimitsSuccess = (limitsResponse: CrossBorderLimits) => ({
  payload: limitsResponse,
  type: AT.SEND_BCH_FETCH_LIMITS_SUCCESS
})
