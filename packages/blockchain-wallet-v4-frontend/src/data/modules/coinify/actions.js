import * as AT from './actionTypes'

export const coinifySignup = () => ({ type: AT.SIGNUP })

export const coinifySignupFailure = (error) => ({ type: AT.COINIFY_SIGNUP_FAILURE, payload: error })

export const coinifyNextStep = (step) => ({ type: AT.COINIFY_NEXT_STEP, payload: step })

export const coinifyClearSignupError = () => ({ type: AT.COINIFY_CLEAR_SIGNUP_ERROR })

export const saveQuote = (quote) => ({ type: AT.COINIFY_SAVE_QUOTE, payload: quote })

export const saveMedium = (medium) => ({ type: AT.COINIFY_SAVE_MEDIUM, payload: medium })
export const saveMediumSuccess = (medium) => ({ type: AT.COINIFY_SAVE_MEDIUM_SUCCESS, payload: medium })

export const initiateBuy = (data) => ({ type: AT.COINIFY_BUY, payload: data })

export const initializeCheckoutForm = (currency) => ({ type: AT.COINIFY_INITIALIZED, payload: currency })

export const coinifyCheckoutBusyOn = () => ({ type: AT.COINIFY_CHECKOUT_BUSY_ON })
export const coinifyCheckoutBusyOff = () => ({ type: AT.COINIFY_CHECKOUT_BUSY_OFF })

export const setCheckoutMax = (amount) => ({ type: AT.COINIFY_SET_CHECKOUT_MAX, payload: amount })
