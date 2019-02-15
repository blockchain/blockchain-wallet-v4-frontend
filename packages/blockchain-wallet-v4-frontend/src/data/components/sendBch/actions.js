import * as AT from './actionTypes'

export const initialized = payload => ({
  type: AT.SEND_BCH_INITIALIZED,
  payload
})
export const destroyed = () => ({ type: AT.SEND_BCH_DESTROYED })
export const sendBchPaymentUpdated = payment => ({
  type: AT.SEND_BCH_PAYMENT_UPDATED,
  payload: payment
})
export const sendBchFirstStepToToggled = val => ({
  type: AT.SEND_BCH_FIRST_STEP_TO_TOGGLED,
  payload: val
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
