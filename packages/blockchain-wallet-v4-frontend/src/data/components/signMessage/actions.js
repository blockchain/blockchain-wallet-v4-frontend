import * as AT from './actionTypes'

export const signMessageInitialized = () => ({
  type: AT.SIGN_MESSAGE_INITIALIZED
})
export const signMessageSubmitted = (addr, message) => ({
  payload: { addr, message },
  type: AT.SIGN_MESSAGE_SUBMITTED
})
export const messageSigned = (signedMessage) => ({
  payload: { signedMessage },
  type: AT.MESSAGE_SIGNED
})
export const resetFormClicked = () => ({ type: AT.RESET_FORM_CLICKED })
