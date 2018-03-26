import * as AT from './actionTypes'

// FETCH_BTC_FEE
export const fetchFee = () => ({ type: AT.FETCH_BTC_FEE })
export const fetchFeeLoading = () => ({ type: AT.FETCH_BTC_FEE_LOADING })
export const fetchFeeSuccess = (data) => ({ type: AT.FETCH_BTC_FEE_SUCCESS, payload: data })
export const fetchFeeFailure = (error) => ({ type: AT.FETCH_BTC_FEE_FAILURE, payload: error })

// FETCH_BTC_RATES
export const fetchRates = () => ({ type: AT.FETCH_BTC_RATES })
export const fetchRatesLoading = () => ({ type: AT.FETCH_BTC_RATES_LOADING })
export const fetchRatesSuccess = (data) => ({ type: AT.FETCH_BTC_RATES_SUCCESS, payload: data })
export const fetchRatesFailure = (error) => ({ type: AT.FETCH_BTC_RATES_FAILURE, payload: error })
