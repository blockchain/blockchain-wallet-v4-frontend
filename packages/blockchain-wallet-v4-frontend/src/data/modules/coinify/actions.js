import * as AT from './actionTypes'

export const coinifySignup = (country) => ({ type: AT.SIGNUP, payload: country })
export const coinifySignupComplete = () => ({ type: AT.COINIFY_SIGNUP_COMPLETE })

export const coinifySignupFailure = (error) => ({ type: AT.COINIFY_SIGNUP_FAILURE, payload: error })

export const coinifyNextStep = (step) => ({ type: AT.COINIFY_NEXT_STEP, payload: step })
export const coinifyNextCheckoutStep = (step) => ({ type: AT.COINIFY_NEXT_CHECKOUT_STEP, payload: step })

export const coinifyClearSignupError = () => ({ type: AT.COINIFY_CLEAR_SIGNUP_ERROR })

export const saveQuote = (quote) => ({ type: AT.COINIFY_SAVE_QUOTE, payload: quote })

export const saveMedium = (medium) => ({ type: AT.COINIFY_SAVE_MEDIUM, payload: medium })
export const saveMediumSuccess = (medium) => ({ type: AT.COINIFY_SAVE_MEDIUM_SUCCESS, payload: medium })

export const initiateBuy = (data) => ({ type: AT.COINIFY_BUY, payload: data })

export const initiateSell = () => ({ type: AT.COINIFY_SELL })

export const initializeCheckoutForm = (type) => ({ type: AT.COINIFY_INITIALIZED, payload: { type } })

export const coinifyCheckoutBusyOn = () => ({ type: AT.COINIFY_CHECKOUT_BUSY_ON })
export const coinifyCheckoutBusyOff = () => ({ type: AT.COINIFY_CHECKOUT_BUSY_OFF })

export const setCheckoutMax = (amount, type) => ({ type: AT.COINIFY_SET_CHECKOUT_MAX, payload: { amount, type } })
export const setCheckoutMin = (amount, type) => ({ type: AT.COINIFY_SET_CHECKOUT_MIN, payload: { amount, type } })

export const setCoinifyCheckoutError = (error) => ({ type: AT.COINIFY_SET_CHECKOUT_ERROR, payload: error })
export const clearCoinifyCheckoutError = () => ({ type: AT.COINIFY_CLEAR_CHECKOUT_ERROR })

export const coinifyNotAsked = () => ({ type: AT.COINIFY_NOT_ASKED })
export const coinifyLoading = () => ({ type: AT.COINIFY_LOADING })
export const coinifySuccess = () => ({ type: AT.COINIFY_SUCCESS })
export const coinifyFailure = (error) => ({ type: AT.COINIFY_FAILURE, payload: error })

export const fromISX = (state) => ({ type: AT.COINIFY_FROM_ISX, payload: state })

export const triggerKYC = () => ({ type: AT.COINIFY_TRIGGER_KYC })

export const openKYC = (kyc) => ({ type: AT.OPEN_KYC, payload: kyc })

export const deleteBankAccount = (account) => ({ type: AT.COINIFY_DELETE_BANK_ACCOUNT, payload: account })

export const cancelISX = () => ({ type: AT.CANCEL_ISX })
export const setCancelTradeId = (id) => ({ type: AT.SET_CANCEL_TRADE_ID, payload: id })

export const finishTrade = (trade) => ({ type: AT.FINISH_TRADE, payload: trade })

export const cancelTrade = (trade) => ({ type: AT.CANCEL_TRADE, payload: trade })
