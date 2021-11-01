import * as AT from './actionTypes'

// FETCH_SETTINGS
export const fetchOptions = () => ({ type: AT.FETCH_OPTIONS })
export const fetchOptionsLoading = () => ({ type: AT.FETCH_OPTIONS_LOADING })
export const fetchOptionsSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_OPTIONS_SUCCESS
})
export const fetchOptionsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_OPTIONS_FAILURE
})
