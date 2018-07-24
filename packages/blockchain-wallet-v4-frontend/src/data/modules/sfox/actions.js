import * as AT from './actionTypes'

export const setBankManually = (routing, account, name, type) => ({ type: AT.SET_BANK_MANUALLY, payload: { routing, account, name, type } })

export const setBankAccount = (bank) => ({ type: AT.SET_BANK, payload: bank })

export const sfoxSignup = () => ({ type: AT.SFOX_SIGNUP })

export const nextStep = (step) => ({ type: AT.NEXT_STEP, payload: step })

export const setProfile = (user) => ({ type: AT.SET_PROFILE, payload: user })

export const upload = (uploadData) => ({ type: AT.UPLOAD, payload: uploadData })

export const clearSignupError = () => ({ type: AT.CLEAR_SIGNUP_ERROR })

export const setVerifyError = (error) => ({ type: AT.SET_VERIFY_ERROR, payload: error })

export const submitMicroDeposits = (data) => ({ type: AT.SUBMIT_MICRO_DEPOSITS, payload: data })

export const submitQuote = (quote) => ({ type: AT.SUBMIT_QUOTE, payload: quote })
export const submitSellQuote = (quote) => ({ type: AT.SUBMIT_SELL_QUOTE, payload: quote })

export const sfoxNotAsked = () => ({ type: AT.SFOX_NOT_ASKED })
export const sfoxLoading = () => ({ type: AT.SFOX_LOADING })
export const sfoxSuccess = () => ({ type: AT.SFOX_SUCCESS })
export const sfoxFailure = (error) => ({ type: AT.SFOX_FAILURE, payload: error })
