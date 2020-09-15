import * as AT from './actionTypes'

export const initialized = payload => ({
  type: AT.SEND_ETH_INITIALIZED,
  payload
})
export const destroyed = () => ({ type: AT.SEND_ETH_DESTROYED })
export const retrySendEth = (txHash: string, isErc20: boolean) => ({
  type: AT.RETRY_SEND_ETH,
  payload: { txHash, isErc20 }
})
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
export const sendEthFirstStepMaximumAmountClicked = coinCode => ({
  type: AT.SEND_ETH_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED,
  payload: coinCode
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
export const sendEthCheckIsContract = address => ({
  type: AT.SEND_ETH_CHECK_IS_CONTRACT,
  payload: address
})
export const sendEthCheckIsContractLoading = () => ({
  type: AT.SEND_ETH_CHECK_IS_CONTRACT_LOADING
})
export const sendEthCheckIsContractSuccess = isContract => ({
  type: AT.SEND_ETH_CHECK_IS_CONTRACT_SUCCESS,
  payload: isContract
})
export const sendEthCheckIsContractFailure = e => ({
  type: AT.SEND_ETH_CHECK_IS_CONTRACT_FAILURE,
  payload: e
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
