import * as AT from './actionTypes'

export const initialized = payload => ({
  type: AT.SEND_BSV_INITIALIZED,
  payload
})
export const destroyed = () => ({ type: AT.SEND_BSV_DESTROYED })
export const sendBsvPaymentUpdated = payment => ({
  type: AT.SEND_BSV_PAYMENT_UPDATED,
  payload: payment
})
export const sendBsvFirstStepToToggled = val => ({
  type: AT.SEND_BSV_FIRST_STEP_TO_TOGGLED,
  payload: val
})
export const sendBsvFirstStepMaximumAmountClicked = () => ({
  type: AT.SEND_BSV_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED
})
export const sendBsvFirstStepSubmitClicked = () => ({
  type: AT.SEND_BSV_FIRST_STEP_SUBMIT_CLICKED
})
export const sendBsvSecondStepInitialized = () => ({
  type: AT.SEND_BSV_SECOND_STEP_INITIALIZED
})
export const sendBsvSecondStepSubmitClicked = () => ({
  type: AT.SEND_BSV_SECOND_STEP_SUBMIT_CLICKED
})
export const sendBsvSecondStepCancelClicked = () => ({
  type: AT.SEND_BSV_SECOND_STEP_CANCEL_CLICKED
})
