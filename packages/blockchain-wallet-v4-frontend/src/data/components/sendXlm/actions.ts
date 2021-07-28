import * as AT from './actionTypes'

export const initialized = (payload) => ({
  payload,
  type: AT.SEND_XLM_INITIALIZED
})
export const destroyed = () => ({ type: AT.SEND_XLM_DESTROYED })
export const paymentUpdatedLoading = () => ({
  type: AT.SEND_XLM_PAYMENT_UPDATED_LOADING
})
export const paymentUpdatedSuccess = (payment) => ({
  payload: payment,
  type: AT.SEND_XLM_PAYMENT_UPDATED_SUCCESS
})
export const paymentUpdatedFailure = (e) => ({
  payload: e,
  type: AT.SEND_XLM_PAYMENT_UPDATED_FAILURE
})
export const firstStepMaximumAmountClicked = () => ({
  type: AT.SEND_XLM_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED
})
export const firstStepSubmitClicked = () => ({
  type: AT.SEND_XLM_FIRST_STEP_SUBMIT_CLICKED
})
export const secondStepSubmitClicked = () => ({
  type: AT.SEND_XLM_SECOND_STEP_SUBMIT_CLICKED
})
export const secondStepCancelClicked = () => ({
  type: AT.SEND_XLM_SECOND_STEP_CANCEL_CLICKED
})
export const sendXlmCheckDestinationAccountExists = (address) => ({
  payload: address,
  type: AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS
})
export const sendXlmCheckDestinationAccountExistsLoading = () => ({
  type: AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_LOADING
})
export const sendXlmCheckDestinationAccountExistsSuccess = (isContract) => ({
  payload: isContract,
  type: AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_SUCCESS
})
export const sendXlmCheckDestinationAccountExistsFailure = (e) => ({
  payload: e,
  type: AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_FAILURE
})
export const sendXlmCheckIfDestinationIsExchange = (address) => ({
  payload: address,
  type: AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE
})
export const sendXlmCheckIfDestinationIsExchangeLoading = () => ({
  type: AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_LOADING
})
export const sendXlmCheckIfDestinationIsExchangeSuccess = (isExchange) => ({
  payload: isExchange,
  type: AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_SUCCESS
})
export const sendXlmCheckIfDestinationIsExchangeFailure = (e) => ({
  payload: e,
  type: AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_FAILURE
})
export const firstStepFeeToggled = () => ({
  type: AT.SEND_XLM_FIRST_STEP_FEE_TOGGLED
})
export const firstStepRegularFeeClicked = () => ({
  type: AT.SEND_XLM_FIRST_STEP_REGULAR_FEE_CLICKED
})
export const firstStepPriorityFeeClicked = () => ({
  type: AT.SEND_XLM_FIRST_STEP_PRIORITY_FEE_CLICKED
})
export const firstStepMinimumFeeClicked = () => ({
  type: AT.SEND_XLM_FIRST_STEP_MINIMUM_FEE_CLICKED
})
export const firstStepMaximumFeeClicked = () => ({
  type: AT.SEND_XLM_FIRST_STEP_MAXIMUM_FEE_CLICKED
})
export const showNoAccountForm = (shouldShow) => ({
  payload: { shouldShow },
  type: AT.SEND_XLM_SHOW_NO_ACCOUNT_FORM
})
