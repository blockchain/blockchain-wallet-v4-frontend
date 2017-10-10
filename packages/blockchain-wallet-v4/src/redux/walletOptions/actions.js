import * as AT from './actionTypes'

export const fetchWalletOptions = (data) => ({ type: AT.FETCH_WALLET_OPTIONS, payload: data })
export const fetchWalletOptionsSuccess = (data) => ({ type: AT.FETCH_WALLET_OPTIONS_SUCCESS, payload: data })
export const fetchWalletOptionsError = (errorKey) => ({ type: AT.FETCH_WALLET_OPTIONS_ERROR, payload: errorKey, error: true })
