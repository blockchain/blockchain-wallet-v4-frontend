import { PaymentValue } from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

export const initialized = payload => ({
  type: AT.SEND_BTC_INITIALIZED,
  payload
})

export const destroyed = () => ({ type: AT.SEND_BTC_DESTROYED })

export const sendBtcPaymentUpdatedSuccess = (payment: PaymentValue) => ({
  type: AT.SEND_BTC_PAYMENT_UPDATED_SUCCESS,
  payload: payment
})
export const sendBtcPaymentUpdatedLoading = () => ({
  type: AT.SEND_BTC_PAYMENT_UPDATED_LOADING
})
export const sendBtcPaymentUpdatedFailure = err => ({
  type: AT.SEND_BTC_PAYMENT_UPDATED_FAILURE,
  payload: err
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
