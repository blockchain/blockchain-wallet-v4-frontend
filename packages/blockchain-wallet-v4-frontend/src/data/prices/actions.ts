import * as AT from './actionTypes'
import { CoinPricesRequestType } from './types'

// FETCH_COIN_PRICES
export const fetchCoinPrices = (request?: CoinPricesRequestType) => ({
  payload: request || {},
  type: AT.FETCH_COIN_PRICES
})
export const fetchCoinPricesLoading = () => ({
  type: AT.FETCH_COIN_PRICES_LOADING
})
export const fetchCoinPricesSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_COIN_PRICES_SUCCESS
})
export const fetchCoinPricesFailure = (data) => ({
  payload: data,
  type: AT.FETCH_COIN_PRICES_FAILURE
})

// FETCH_COIN_PRICES_PREVIOUS_DAY
export const fetchCoinPricesPreviousDay = (request?: CoinPricesRequestType) => ({
  payload: request || {},
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY
})
export const fetchCoinPricesPreviousDayLoading = () => ({
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY_LOADING
})
export const fetchCoinPricesPreviousDaySuccess = (data) => ({
  payload: data,
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY_SUCCESS
})
export const fetchCoinPricesPreviousDayFailure = (data) => ({
  payload: data,
  type: AT.FETCH_COIN_PRICES_PREVIOUS_DAY_FAILURE
})
