import * as AT from './actionTypes'

export const signMessageInitialized = () => ({
  type: AT.SIGN_MESSAGE_INITIALIZED
})
export const signMessageSubmitted = (addr, message) => ({
  type: AT.SIGN_MESSAGE_SUBMITTED,
  payload: { addr, message }
})
export const messageSigned = signedMessage => ({
  type: AT.MESSAGE_SIGNED,
  payload: { signedMessage }
})
export const resetFormClicked = () => ({ type: AT.RESET_FORM_CLICKED })
