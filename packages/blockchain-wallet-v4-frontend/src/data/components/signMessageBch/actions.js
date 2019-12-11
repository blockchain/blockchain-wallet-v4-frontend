import * as AT from './actionTypes'

export const signMessageInitialized = () => ({
  type: AT.BCH_SIGN_MESSAGE_INITIALIZED
})
export const signMessageSubmitted = (addr, message, priv) => ({
  type: AT.BCH_SIGN_MESSAGE_SUBMITTED,
  payload: { addr, message, priv }
})
export const messageSigned = signedMessage => ({
  type: AT.BCH_MESSAGE_SIGNED,
  payload: { signedMessage }
})
export const resetFormClicked = () => ({ type: AT.BCH_RESET_FORM_CLICKED })
