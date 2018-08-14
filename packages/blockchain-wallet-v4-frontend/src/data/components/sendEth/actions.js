import * as AT from './actionTypes'

export const initialized = payload => ({
  type: AT.SEND_ETH_INITIALIZED,
  payload
})
export const destroyed = () => ({ type: AT.SEND_ETH_DESTROYED })
export const sendEthPaymentUpdated = payment => ({
  type: AT.SEND_ETH_PAYMENT_UPDATED,
  payload: payment
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
export const sendEthFirstStepFeeToggled = () => ({
  type: AT.SEND_ETH_FIRST_STEP_FEE_TOGGLED
})
export const sendEthFirstStepRegularFeeClicked = () => ({
  type: AT.SEND_ETH_FIRST_STEP_REGULAR_FEE_CLICKED
})
export const sendEthFirstStepPriorityFeeClicked = () => ({
  type: AT.SEND_ETH_FIRST_STEP_PRIORITY_FEE_CLICKED
})
