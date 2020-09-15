import * as AT from './actionTypes'

export const initialized = payload => ({
  type: AT.INITIALIZED,
  payload
})
export const destroyed = () => ({ type: AT.DESTROYED })
export const paymentUpdatedLoading = () => ({
  type: AT.PAYMENT_UPDATED_LOADING
})
export const paymentUpdatedSuccess = payment => ({
  type: AT.PAYMENT_UPDATED_SUCCESS,
  payload: payment
})
export const paymentUpdatedFailure = e => ({
  type: AT.PAYMENT_UPDATED_FAILURE,
  payload: e
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
export const sendXlmCheckDestinationAccountExists = address => ({
  type: AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS,
  payload: address
})
export const sendXlmCheckDestinationAccountExistsLoading = () => ({
  type: AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_LOADING
})
export const sendXlmCheckDestinationAccountExistsSuccess = isContract => ({
  type: AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_SUCCESS,
  payload: isContract
})
export const sendXlmCheckDestinationAccountExistsFailure = e => ({
  type: AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_FAILURE,
  payload: e
})
export const sendXlmCheckIfDestinationIsExchange = address => ({
  type: AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE,
  payload: address
})
export const sendXlmCheckIfDestinationIsExchangeLoading = () => ({
  type: AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_LOADING
})
export const sendXlmCheckIfDestinationIsExchangeSuccess = isExchange => ({
  type: AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_SUCCESS,
  payload: isExchange
})
export const sendXlmCheckIfDestinationIsExchangeFailure = e => ({
  type: AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_FAILURE,
  payload: e
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
