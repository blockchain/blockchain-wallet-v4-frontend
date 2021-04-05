import {
  CoinType,
  FiatType,
  MiscActionTypes,
  PriceMovementDirType,
  TimeRange
} from 'core/types'

import * as AT from './actionTypes'

// FETCH_CAPTCHA
export const fetchCaptcha = () => ({ type: AT.FETCH_CAPTCHA })
export const fetchCaptchaLoading = () => ({ type: AT.FETCH_CAPTCHA_LOADING })
export const fetchCaptchaSuccess = data => ({
  type: AT.FETCH_CAPTCHA_SUCCESS,
  payload: data
})
export const fetchCaptchaFailure = error => ({
  type: AT.FETCH_CAPTCHA_FAILURE,
  payload: error
})

// FETCH_PRICE_CHANGE
export const fetchPriceChange = (
  base: CoinType,
  quote: FiatType,
  range: TimeRange,
  positionAmt?: string
) => ({
  type: AT.FETCH_PRICE_CHANGE,
  payload: { base, quote, range, positionAmt }
})
export const fetchPriceChangeLoading = (
  base: CoinType,
  range: TimeRange
): MiscActionTypes => ({
  type: AT.FETCH_PRICE_CHANGE_LOADING,
  payload: { base, range }
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
  type: AT.FETCH_PRICE_CHANGE_SUCCESS,
  payload: {
    base,
    currentPrice,
    overallChange,
    positionChange,
    previousPrice,
    range
  }
})
export const fetchPriceChangeFailure = (
  base,
  error,
  range: TimeRange
): MiscActionTypes => ({
  type: AT.FETCH_PRICE_CHANGE_FAILURE,
  payload: {
    base,
    error,
    range
  }
})

// FETCH_PRICE_INDEX_SERIES
export const fetchPriceIndexSeries = (coin, currency, start, scale) => ({
  type: AT.FETCH_PRICE_INDEX_SERIES,
  payload: { coin, currency, start, scale }
})
export const fetchPriceIndexSeriesLoading = () => ({
  type: AT.FETCH_PRICE_INDEX_SERIES_LOADING
})
export const fetchPriceIndexSeriesSuccess = data => ({
  type: AT.FETCH_PRICE_INDEX_SERIES_SUCCESS,
  payload: data
})
export const fetchPriceIndexSeriesFailure = error => ({
  type: AT.FETCH_PRICE_INDEX_SERIES_FAILURE,
  payload: error
})

// ENCODE_PAIRING_CODE
export const encodePairingCode = () => ({ type: AT.ENCODE_PAIRING_CODE })
export const encodePairingCodeLoading = () => ({
  type: AT.ENCODE_PAIRING_CODE_LOADING
})
export const encodePairingCodeSuccess = data => ({
  type: AT.ENCODE_PAIRING_CODE_SUCCESS,
  payload: data
})
export const encodePairingCodeFailure = error => ({
  type: AT.ENCODE_PAIRING_CODE_FAILURE,
  payload: error
})

// AUTHORIZE_LOGIN
export const authorizeLogin = (token, confirm?: any) => ({
  type: AT.AUTHORIZE_LOGIN,
  payload: { token, confirm }
})
export const authorizeLoginLoading = () => ({
  type: AT.AUTHORIZE_LOGIN_LOADING
})
export const authorizeLoginSuccess = data => ({
  type: AT.AUTHORIZE_LOGIN_SUCCESS,
  payload: data
})
export const authorizeLoginFailure = data => ({
  type: AT.AUTHORIZE_LOGIN_FAILURE,
  payload: data
})

// HANDLE_2FA_RESET
export const handle2FAReset = token => ({
  type: AT.HANDLE_2FA_RESET,
  payload: { token }
})
export const handle2FAResetLoading = () => ({
  type: AT.HANDLE_2FA_RESET_LOADING
})
export const handle2FAResetSuccess = data => ({
  type: AT.HANDLE_2FA_RESET_SUCCESS,
  payload: data
})
export const handle2FAResetFailure = data => ({
  type: AT.HANDLE_2FA_RESET_FAILURE,
  payload: data
})

// VERIFY_EMAIL_TOKEN
export const verifyEmailToken = token => ({
  type: AT.VERIFY_EMAIL_TOKEN,
  payload: { token }
})
export const verifyEmailTokenLoading = () => ({
  type: AT.VERIFY_EMAIL_TOKEN_LOADING
})
export const verifyEmailTokenSuccess = data => ({
  type: AT.VERIFY_EMAIL_TOKEN_SUCCESS,
  payload: data
})
export const verifyEmailTokenFailure = data => ({
  type: AT.VERIFY_EMAIL_TOKEN_FAILURE,
  payload: data
})

export const sendSecureChannelMessage = data => ({
  type: AT.SECURE_CHANNEL_SEND,
  payload: data
})
