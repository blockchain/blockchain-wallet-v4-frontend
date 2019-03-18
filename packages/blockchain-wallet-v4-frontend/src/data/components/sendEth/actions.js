import * as AT from './actionTypes'

export const initialized = payload => ({
  type: AT.SEND_ETH_INITIALIZED,
  payload
})
export const destroyed = () => ({ type: AT.SEND_ETH_DESTROYED })
export const sendEthPaymentUpdatedLoading = () => ({
  type: AT.SEND_ETH_PAYMENT_UPDATED_LOADING
})
export const sendEthPaymentUpdatedSuccess = payment => ({
  type: AT.SEND_ETH_PAYMENT_UPDATED_SUCCESS,
  payload: payment
})
export const sendEthPaymentUpdatedFailure = e => ({
  type: AT.SEND_ETH_PAYMENT_UPDATED_FAILURE,
  payload: e
})
export const sendEthFirstStepMaximumAmountClicked = () => ({
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
export const sendEthFirstStepToToggled = val => ({
  type: AT.SEND_ETH_FIRST_STEP_TO_TOGGLED,
  payload: val
})
export const sendEthFirstStepFeeToggled = () => ({
  type: AT.SEND_ETH_FIRST_STEP_FEE_TOGGLED
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
