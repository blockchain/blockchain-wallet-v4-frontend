import * as T from './actionTypes'

export const fetchRatesSuccess = (data) =>
  ({ type: T.FETCH_RATES_SUCCESS, payload: data })
export const fetchRatesError = (data) =>
  ({ type: T.FETCH_RATES_ERROR, payload: data })
