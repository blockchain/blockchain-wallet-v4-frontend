import * as AT from './actionTypes'

export const fetchTrades = data => ({ type: AT.FETCH_TRADES, payload: data })
export const fetchTradesLoading = () => ({ type: AT.FETCH_TRADES_LOADING })
export const fetchTradesSuccess = data => ({
  type: AT.FETCH_TRADES_SUCCESS,
  payload: data
})
export const fetchTradesFailure = error => ({
  type: AT.FETCH_TRADES_FAILURE,
  payload: error
})

export const fetchProfile = data => ({ type: AT.FETCH_PROFILE, payload: data })
export const fetchProfileLoading = () => ({ type: AT.FETCH_PROFILE_LOADING })
export const fetchProfileSuccess = data => ({
  type: AT.FETCH_PROFILE_SUCCESS,
  payload: data
})
export const fetchProfileFailure = error => ({
  type: AT.FETCH_PROFILE_FAILURE,
  payload: error
})
export const refetchProfile = () => ({ type: AT.REFETCH_PROFILE })

export const fetchSfoxAccounts = () => ({
  type: AT.FETCH_SFOX_ACCOUNTS,
  payload: {}
})
export const fetchSfoxAccountsLoading = () => ({
  type: AT.FETCH_SFOX_ACCOUNTS_LOADING
})
export const fetchSfoxAccountsSuccess = data => ({
  type: AT.FETCH_SFOX_ACCOUNTS_SUCCESS,
  payload: data
})
export const fetchSfoxAccountsFailure = error => ({
  type: AT.FETCH_SFOX_ACCOUNTS_FAILURE,
  payload: error
})

export const resetProfile = () => ({ type: AT.RESET_PROFILE })
