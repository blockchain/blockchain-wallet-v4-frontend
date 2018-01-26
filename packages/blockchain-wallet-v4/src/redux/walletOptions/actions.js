import * as AT from './actionTypes'

export const setWalletOptions = (data) => ({ type: AT.SET_WALLET_OPTIONS, payload: { data } })

// FETCH_SETTINGS
export const fetchOptions = () => ({ type: AT.FETCH_OPTIONS })
export const fetchOptionsLoading = () => ({ type: AT.FETCH_OPTIONS_LOADING })
export const fetchOptionsSuccess = (data) => ({ type: AT.FETCH_OPTIONS_SUCCESS, payload: data })
export const fetchOptionsFailure = (error) => ({ type: AT.FETCH_OPTIONS_FAILURE, payload: error })
