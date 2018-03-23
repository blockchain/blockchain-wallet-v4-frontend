import * as AT from './actionTypes'

// FETCH_BCH_RATES
export const fetchRates = () => ({ type: AT.FETCH_BCH_RATES })
export const fetchRatesLoading = () => ({ type: AT.FETCH_BCH_RATES_LOADING })
export const fetchRatesSuccess = (data) => ({ type: AT.FETCH_BCH_RATES_SUCCESS, payload: data })
export const fetchRatesFailure = (error) => ({ type: AT.FETCH_BCH_RATES_FAILURE, payload: error })
