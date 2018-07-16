import * as AT from './actionTypes'

export const setBankManually = (routing, account, name, type) => ({
  type: AT.SET_BANK_MANUALLY,
  payload: { routing, account, name, type }
})

export const setBankAccount = bank => ({ type: AT.SET_BANK, payload: bank })

export const sfoxSignup = () => ({ type: AT.SFOX_SIGNUP })

export const nextStep = step => ({ type: AT.NEXT_STEP, payload: step })

export const setProfile = user => ({ type: AT.SET_PROFILE, payload: user })

export const upload = uploadData => ({ type: AT.UPLOAD, payload: uploadData })

export const clearSignupError = () => ({ type: AT.CLEAR_SIGNUP_ERROR })

export const setVerifyError = error => ({
  type: AT.SET_VERIFY_ERROR,
  payload: error
})

export const submitMicroDeposits = data => ({
  type: AT.SUBMIT_MICRO_DEPOSITS,
  payload: data
})

export const submitQuote = quote => ({ type: AT.SUBMIT_QUOTE, payload: quote })
export const submitSellQuote = quote => ({
  type: AT.SUBMIT_SELL_QUOTE,
  payload: quote
})

export const sfoxNotAsked = () => ({ type: AT.SFOX_NOT_ASKED })
export const sfoxLoading = () => ({ type: AT.SFOX_LOADING })
export const sfoxSuccess = () => ({ type: AT.SFOX_SUCCESS })
export const sfoxFailure = error => ({ type: AT.SFOX_FAILURE, payload: error })

export const enableSiftScience = () => ({ type: AT.ENABLE_SIFT_SCIENCE })
export const disableSiftScience = () => ({ type: AT.DISABLE_SIFT_SCIENCE })

export const handleModalClose = () => ({ type: AT.HANDLE_MODAL_CLOSE })

export const initializePayment = payload => ({
  type: AT.SFOX_INITIALIZE_PAYMENT,
  payload
})

export const sfoxSellBtcPaymentUpdatedSuccess = payment => ({
  type: AT.SFOX_SELL_BTC_PAYMENT_UPDATED_SUCCESS,
  payload: payment
})
export const sfoxSellBtcPaymentUpdatedLoading = () => ({
  type: AT.SFOX_SELL_BTC_PAYMENT_UPDATED_LOADING
})
export const sfoxSellBtcPaymentUpdatedFailure = err => ({
  type: AT.SFOX_SELL_BTC_PAYMENT_UPDATED_FAILURE,
  payload: err
})
