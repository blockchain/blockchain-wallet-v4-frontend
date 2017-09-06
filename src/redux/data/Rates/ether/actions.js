import * as T from './actionTypes'

export const fetchEthRatesSuccess = (data) =>
  ({ type: T.FETCH_ETH_RATES_SUCCESS, payload: data })
export const fetchEthRatesError = (message) =>
  ({ type: T.FETCH_ETH_RATES_ERROR, payload: message })
