import * as AT from './actionTypes'

// FETCH_COIN_PRICES
export const fetchCoinPrices = (coins, fiatCurrency, timestamp) => ({
  type: AT.FETCH_COIN_PRICES,
  payload: { coins, fiatCurrency, timestamp }
})
export const fetchCoinPricesLoading = () => ({
  type: AT.FETCH_COIN_PRICES_LOADING
})
export const fetchCoinPricesSuccess = data => ({
  type: AT.FETCH_COIN_PRICES_SUCCESS,
  payload: data
})
export const fetchCoinPricesFailure = data => ({
  type: AT.FETCH_COIN_PRICES_FAILURE,
  payload: data
})

// FETCH_COIN_PRICES_PREVIOUS_DAY
export const fetchCoinPricesPreviousDay = (coins, fiatCurrency, timestamp) => ({
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY,
  payload: { coins, fiatCurrency, timestamp }
})
export const fetchCoinPricesPreviousDayLoading = () => ({
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY_LOADING
})
export const fetchCoinPricesPreviousDaySuccess = data => ({
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY_SUCCESS,
  payload: data
})
export const fetchCoinPricesPreviousDayFailure = data => ({
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY_FAILURE,
  payload: data
})
