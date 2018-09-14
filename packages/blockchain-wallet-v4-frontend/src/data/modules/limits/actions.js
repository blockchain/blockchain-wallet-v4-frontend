import * as AT from './actionTypes'

export const fetchLimits = currency => ({
  type: AT.FETCH_LIMITS,
  payload: { currency }
})
export const fetchLimitsLoading = currency => ({
  type: AT.FETCH_LIMITS_LOADING,
  payload: { currency }
})
export const fetchLimitsSuccess = (currency, limits) => ({
  type: AT.FETCH_LIMITS_SUCCESS,
  payload: { currency, limits }
})
export const fetchLimitsError = (currency, error) => ({
  type: AT.FETCH_LIMITS_ERROR,
  payload: { currency, error }
})
