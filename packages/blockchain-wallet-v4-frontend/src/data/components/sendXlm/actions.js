import * as AT from './actionTypes'

export const initialized = payload => ({
  type: AT.INITIALIZED,
  payload
})
export const destroyed = () => ({ type: AT.DESTROYED })
export const paymentUpdated = payment => ({
  type: AT.PAYMENT_UPDATED,
  payload: payment
})
export const firstStepMaximumAmountClicked = () => ({
  type: AT.FIRST_STEP_MAXIMUM_AMOUNT_CLICKED
})
export const firstStepSubmitClicked = () => ({
  type: AT.FIRST_STEP_SUBMIT_CLICKED
})
export const secondStepSubmitClicked = () => ({
  type: AT.SECOND_STEP_SUBMIT_CLICKED
})
export const secondStepCancelClicked = () => ({
  type: AT.SECOND_STEP_CANCEL_CLICKED
})
export const firstStepToToggled = val => ({
  type: AT.FIRST_STEP_TO_TOGGLED,
  payload: val
})
export const firstStepFeeToggled = () => ({
  type: AT.FIRST_STEP_FEE_TOGGLED
})
export const firstStepRegularFeeClicked = () => ({
  type: AT.FIRST_STEP_REGULAR_FEE_CLICKED
})
export const firstStepPriorityFeeClicked = () => ({
  type: AT.FIRST_STEP_PRIORITY_FEE_CLICKED
})
export const firstStepMinimumFeeClicked = () => ({
  type: AT.FIRST_STEP_MINIMUM_FEE_CLICKED
})
export const firstStepMaximumFeeClicked = () => ({
  type: AT.FIRST_STEP_MAXIMUM_FEE_CLICKED
})
export const showNoAccountForm = shouldShow => ({
  type: AT.SHOW_NO_ACCOUNT_FORM,
  payload: { shouldShow }
})
