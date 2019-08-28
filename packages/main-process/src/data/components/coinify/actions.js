import * as AT from './actionTypes'

export const coinifySignup = country => ({ type: AT.SIGNUP, payload: country })

export const coinifyNextCheckoutStep = step => ({
  type: AT.COINIFY_NEXT_CHECKOUT_STEP,
  payload: step
})

export const setMedium = medium => ({
  type: AT.COINIFY_SET_MEDIUM,
  payload: medium
})

export const initiateBuy = data => ({ type: AT.COINIFY_BUY, payload: data })

export const initiateSell = () => ({ type: AT.COINIFY_SELL })

export const initializeCheckoutForm = type => ({
  type: AT.COINIFY_INITIALIZED,
  payload: { type }
})

export const coinifyCheckoutBusyOn = () => ({
  type: AT.COINIFY_CHECKOUT_BUSY_ON
})
export const coinifyCheckoutBusyOff = () => ({
  type: AT.COINIFY_CHECKOUT_BUSY_OFF
})

export const setCoinifyCheckoutError = error => ({
  type: AT.COINIFY_SET_CHECKOUT_ERROR,
  payload: error
})
export const clearCoinifyCheckoutError = () => ({
  type: AT.COINIFY_CLEAR_CHECKOUT_ERROR
})

export const fromISX = state => ({ type: AT.COINIFY_FROM_ISX, payload: state })

export const coinifyNotAsked = () => ({ type: AT.COINIFY_NOT_ASKED })
export const coinifyLoading = () => ({ type: AT.COINIFY_LOADING })
export const coinifySuccess = () => ({ type: AT.COINIFY_SUCCESS })
export const coinifyFailure = error => ({
  type: AT.COINIFY_FAILURE,
  payload: error
})

export const deleteBankAccount = account => ({
  type: AT.COINIFY_DELETE_BANK_ACCOUNT,
  payload: account
})

export const cancelISX = () => ({ type: AT.CANCEL_ISX })
export const setCancelTradeId = id => ({
  type: AT.SET_CANCEL_TRADE_ID,
  payload: id
})

export const finishTrade = trade => ({ type: AT.FINISH_TRADE, payload: trade })

export const cancelTrade = trade => ({ type: AT.CANCEL_TRADE, payload: trade })

export const cancelSubscription = subscription => ({
  type: AT.CANCEL_SUBSCRIPTION,
  payload: subscription
})

export const initializePayment = () => ({
  type: AT.COINIFY_INITIALIZE_PAYMENT
})

export const coinifySellBtcPaymentUpdatedSuccess = payment => ({
  type: AT.COINIFY_SELL_BTC_PAYMENT_UPDATED_SUCCESS,
  payload: payment
})
export const coinifySellBtcPaymentUpdatedLoading = () => ({
  type: AT.COINIFY_SELL_BTC_PAYMENT_UPDATED_LOADING
})
export const coinifySellBtcPaymentUpdatedFailure = err => ({
  type: AT.COINIFY_SELL_BTC_PAYMENT_UPDATED_FAILURE,
  payload: err
})
export const setCountry = country => ({
  type: AT.COINIFY_SET_COUNTRY,
  payload: country
})

export const fetchCoinifyData = () => ({
  type: AT.FETCH_COINIFY_DATA
})
export const compareCoinifyKyc = () => ({
  type: AT.COMPARE_COINIFY_KYC
})
