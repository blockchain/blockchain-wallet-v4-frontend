import * as T from './actionTypes'

export const fetchRatesSuccess = (data) =>
  ({ type: T.FETCH_RATES_SUCCESS, payload: data })
export const fetchRatesError = (message) =>
  ({ type: T.FETCH_RATES_ERROR, payload: message })
