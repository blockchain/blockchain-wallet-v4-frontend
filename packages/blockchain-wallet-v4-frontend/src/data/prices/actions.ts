import * as AT from './actionTypes'
import { CoinPricesRequestType } from './types'

// FETCH_COIN_PRICES
export const fetchCoinPrices = (request?: CoinPricesRequestType) => ({
  type: AT.FETCH_COIN_PRICES,
  payload: request || {}
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
export const fetchCoinPricesPreviousDay = (
  request?: CoinPricesRequestType
) => ({
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY,
  payload: request || {}
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
