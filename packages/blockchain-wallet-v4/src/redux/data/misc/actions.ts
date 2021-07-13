import { CoinType, FiatType, MiscActionTypes, PriceMovementDirType, TimeRange } from 'core/types'

import * as AT from './actionTypes'

// FETCH_PRICE_CHANGE
export const fetchPriceChange = (
  base: CoinType,
  quote: FiatType,
  range: TimeRange,
  positionAmt?: string
) => ({
  payload: { base, positionAmt, quote, range },
  type: AT.FETCH_PRICE_CHANGE
})
export const fetchPriceChangeLoading = (base: CoinType, range: TimeRange): MiscActionTypes => ({
  payload: { base, range },
  type: AT.FETCH_PRICE_CHANGE_LOADING
})
export const fetchPriceChangeSuccess = (
  base: CoinType,
  previousPrice: number,
  currentPrice: number,
  range: TimeRange,
  overallChange: {
    diff: string
    movement: PriceMovementDirType
    percentChange: string
  },
  positionChange: {
    diff: string
    movement: PriceMovementDirType
    percentChange: string
  }
): MiscActionTypes => ({
  payload: {
    base,
    currentPrice,
    overallChange,
    positionChange,
    previousPrice,
    range
  },
  type: AT.FETCH_PRICE_CHANGE_SUCCESS
})
export const fetchPriceChangeFailure = (base, error, range: TimeRange): MiscActionTypes => ({
  payload: {
    base,
    error,
    range
  },
  type: AT.FETCH_PRICE_CHANGE_FAILURE
})

// FETCH_PRICE_INDEX_SERIES
export const fetchPriceIndexSeries = (coin, currency, start, scale) => ({
  payload: { coin, currency, scale, start },
  type: AT.FETCH_PRICE_INDEX_SERIES
})
export const fetchPriceIndexSeriesLoading = () => ({
  type: AT.FETCH_PRICE_INDEX_SERIES_LOADING
})
export const fetchPriceIndexSeriesSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_PRICE_INDEX_SERIES_SUCCESS
})
export const fetchPriceIndexSeriesFailure = (error) => ({
  payload: error,
  type: AT.FETCH_PRICE_INDEX_SERIES_FAILURE
})

// ENCODE_PAIRING_CODE
export const encodePairingCode = () => ({ type: AT.ENCODE_PAIRING_CODE })
export const encodePairingCodeLoading = () => ({
  type: AT.ENCODE_PAIRING_CODE_LOADING
})
export const encodePairingCodeSuccess = (data) => ({
  payload: data,
  type: AT.ENCODE_PAIRING_CODE_SUCCESS
})
export const encodePairingCodeFailure = (error) => ({
  payload: error,
  type: AT.ENCODE_PAIRING_CODE_FAILURE
})

// AUTHORIZE_LOGIN
export const authorizeLogin = (token, confirm?: any) => ({
  payload: { confirm, token },
  type: AT.AUTHORIZE_LOGIN
})
export const authorizeLoginLoading = () => ({
  type: AT.AUTHORIZE_LOGIN_LOADING
})
export const authorizeLoginSuccess = (data) => ({
  payload: data,
  type: AT.AUTHORIZE_LOGIN_SUCCESS
})
export const authorizeLoginFailure = (data) => ({
  payload: data,
  type: AT.AUTHORIZE_LOGIN_FAILURE
})

// HANDLE_2FA_RESET
export const handle2FAReset = (token) => ({
  payload: { token },
  type: AT.HANDLE_2FA_RESET
})
export const handle2FAResetLoading = () => ({
  type: AT.HANDLE_2FA_RESET_LOADING
})
export const handle2FAResetSuccess = (data) => ({
  payload: data,
  type: AT.HANDLE_2FA_RESET_SUCCESS
})
export const handle2FAResetFailure = (data) => ({
  payload: data,
  type: AT.HANDLE_2FA_RESET_FAILURE
})

// VERIFY_EMAIL_TOKEN
export const verifyEmailToken = (token) => ({
  payload: { token },
  type: AT.VERIFY_EMAIL_TOKEN
})
export const verifyEmailTokenLoading = () => ({
  type: AT.VERIFY_EMAIL_TOKEN_LOADING
})
export const verifyEmailTokenSuccess = (data) => ({
  payload: data,
  type: AT.VERIFY_EMAIL_TOKEN_SUCCESS
})
export const verifyEmailTokenFailure = (data) => ({
  payload: data,
  type: AT.VERIFY_EMAIL_TOKEN_FAILURE
})

export const sendSecureChannelMessage = (data) => ({
  payload: data,
  type: AT.SECURE_CHANNEL_SEND
})
