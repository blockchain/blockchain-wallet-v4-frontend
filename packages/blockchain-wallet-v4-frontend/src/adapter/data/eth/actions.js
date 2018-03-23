import * as AT from './actionTypes'

// FETCH_ETH_DATA
export const fetchData = (context) => ({ type: AT.FETCH_ETH_DATA, payload: { context } })
export const fetchDataLoading = () => ({ type: AT.FETCH_ETH_DATA_LOADING })
export const fetchDataSuccess = (data) => ({ type: AT.FETCH_ETH_DATA_SUCCESS, payload: data })
export const fetchDataFailure = (error) => ({ type: AT.FETCH_ETH_DATA_FAILURE, payload: error })

// FETCH_ETH_RATES
export const fetchRates = () => ({ type: AT.FETCH_ETH_RATES })
export const fetchRatesLoading = () => ({ type: AT.FETCH_ETH_RATES_LOADING })
export const fetchRatesSuccess = (data) => ({ type: AT.FETCH_ETH_RATES_SUCCESS, payload: data })
export const fetchRatesFailure = (error) => ({ type: AT.FETCH_ETH_RATES_FAILURE, payload: error })
