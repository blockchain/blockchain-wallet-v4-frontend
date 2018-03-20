import * as AT from './actionTypes'

export const coinifySignup = () => ({ type: AT.SIGNUP })

export const coinifySignupFailure = (error) => ({ type: AT.COINIFY_SIGNUP_FAILURE, payload: error })

export const coinifyNextStep = (step) => ({ type: AT.COINIFY_NEXT_STEP, payload: step })

export const coinifyClearSignupError = () => ({ type: AT.COINIFY_CLEAR_SIGNUP_ERROR })

export const saveQuote = (quote) => ({ type: AT.COINIFY_SAVE_QUOTE, payload: quote })
