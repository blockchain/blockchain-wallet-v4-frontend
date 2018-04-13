import * as AT from './actionTypes'

// FETCH_CAPTCHA
export const fetchCaptcha = () => ({ type: AT.FETCH_CAPTCHA })
export const fetchCaptchaLoading = () => ({ type: AT.FETCH_CAPTCHA_LOADING })
export const fetchCaptchaSuccess = (data) => ({ type: AT.FETCH_CAPTCHA_SUCCESS, payload: data })
export const fetchCaptchaFailure = (error) => ({ type: AT.FETCH_CAPTCHA_FAILURE, payload: error })

// FETCH_LOGS
export const fetchLogs = () => ({ type: AT.FETCH_LOGS })
export const fetchLogsLoading = () => ({ type: AT.FETCH_LOGS_LOADING })
export const fetchLogsSuccess = (data) => ({ type: AT.FETCH_LOGS_SUCCESS, payload: data })
export const fetchLogsFailure = (error) => ({ type: AT.FETCH_LOGS_FAILURE, payload: error })

// FETCH_PRICE_INDEX_SERIES
export const fetchPriceIndexSeries = (coin, currency, start, scale) => ({ type: AT.FETCH_PRICE_INDEX_SERIES, payload: { coin, currency, start, scale } })
export const fetchPriceIndexSeriesLoading = () => ({ type: AT.FETCH_PRICE_INDEX_SERIES_LOADING })
export const fetchPriceIndexSeriesSuccess = (data) => ({ type: AT.FETCH_PRICE_INDEX_SERIES_SUCCESS, payload: data })
export const fetchPriceIndexSeriesFailure = (error) => ({ type: AT.FETCH_PRICE_INDEX_SERIES_FAILURE, payload: error })

// ENCODE_PAIRING_CODE
export const encodePairingCode = () => ({ type: AT.ENCODE_PAIRING_CODE })
export const encodePairingCodeLoading = () => ({ type: AT.ENCODE_PAIRING_CODE_LOADING })
export const encodePairingCodeSuccess = (data) => ({ type: AT.ENCODE_PAIRING_CODE_SUCCESS, payload: data })
export const encodePairingCodeFailure = (error) => ({ type: AT.ENCODE_PAIRING_CODE_FAILURE, payload: error })
