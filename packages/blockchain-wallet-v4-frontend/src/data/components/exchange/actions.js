import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.EXCHANGE_INITIALIZED })
export const destroyed = () => ({ type: AT.EXCHANGE_DESTROYED })
export const paymentUpdated = payment => ({
  type: AT.EXCHANGE_PAYMENT_UPDATED,
  payload: payment
})
export const orderUpdated = order => ({
  type: AT.EXCHANGE_ORDER_UPDATED,
  payload: order
})
export const firstStepInitialized = () => ({
  type: AT.EXCHANGE_FIRST_STEP_INITIALIZED
})
export const firstStepEnabled = () => ({
  type: AT.EXCHANGE_FIRST_STEP_ENABLED
})
export const firstStepDisabled = () => ({
  type: AT.EXCHANGE_FIRST_STEP_DISABLED
})
export const firstStepFormValidated = () => ({
  type: AT.EXCHANGE_FIRST_STEP_FORM_VALIDATED
})
export const firstStepFormUnvalidated = error => ({
  type: AT.EXCHANGE_FIRST_STEP_FORM_UNVALIDATED,
  payload: error
})
export const firstStepSubmitClicked = () => ({
  type: AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED
})
export const firstStepSwapClicked = () => ({
  type: AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED
})
export const firstStepMinimumClicked = () => ({
  type: AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED
})
export const firstStepMaximumClicked = () => ({
  type: AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED
})
export const secondStepInitialized = () => ({
  type: AT.EXCHANGE_SECOND_STEP_INITIALIZED
})
export const secondStepSuccess = data => ({
  type: AT.EXCHANGE_SECOND_STEP_SUCCESS,
  payload: data
})
export const secondStepFailure = error => ({
  type: AT.EXCHANGE_SECOND_STEP_FAILURE,
  payload: error
})
export const secondStepSubmitClicked = () => ({
  type: AT.EXCHANGE_SECOND_STEP_SUBMIT_CLICKED
})
export const secondStepPaymentSent = payment => ({
  type: AT.EXCHANGE_SECOND_STEP_PAYMENT_SENT,
  payload: payment
})
export const secondStepCancelClicked = () => ({
  type: AT.EXCHANGE_SECOND_STEP_CANCEL_CLICKED
})
export const secondStepOrderExpired = () => ({
  type: AT.EXCHANGE_SECOND_STEP_ORDER_EXPIRED
})
export const secondStepGoBack = () => ({
  type: AT.EXCHANGE_SECOND_STEP_GOBACK
})
export const thirdStepInitialized = () => ({
  type: AT.EXCHANGE_THIRD_STEP_INITIALIZED
})
export const thirdStepTradeStatusChanged = status => ({
  type: AT.EXCHANGE_THIRD_STEP_TRADE_STATUS_CHANGED,
  payload: status
})
export const thirdStepCloseClicked = () => ({
  type: AT.EXCHANGE_THIRD_STEP_CLOSE_CLICKED
})
export const usStateRegistered = () => ({
  type: AT.EXCHANGE_US_STATE_REGISTERED
})
export const changeSource = source => ({
  type: AT.CHANGE_SOURCE,
  pyaload: { source }
})
export const changeTarget = target => ({
  type: AT.CHANGE_TARGET,
  pyaload: { target }
})
export const changeSourceAmount = sourceAmount => ({
  type: AT.CHANGE_SOURCE_AMOUNT,
  payload: { sourceAmount }
})
export const changeTargetAmount = targetAmount => ({
  type: AT.CHANGE_TARGET_AMOUNT,
  payload: { targetAmount }
})
export const changeSourceFiatAmount = sourceFiatAmount => ({
  type: AT.CHANGE_SOURCE_FIAT_AMOUNT,
  payload: { sourceFiatAmount }
})
export const changeTargetFiatAmount = targetFiatAmount => ({
  type: AT.CHANGE_TARGET_FIAT_AMOUNT,
  payload: { targetFiatAmount }
})
