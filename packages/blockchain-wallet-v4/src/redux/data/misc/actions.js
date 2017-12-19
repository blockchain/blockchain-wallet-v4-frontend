import * as AT from './actionTypes'

export const fetchAdverts = () => ({ type: AT.FETCH_ADVERTS })

export const fetchAdvertsSuccess = (data) => ({ type: AT.FETCH_ADVERTS_SUCCESS, payload: data })

export const fetchAdvertsFailure = (error) => ({ type: AT.FETCH_ADVERTS_FAILURE, payload: error })

export const fetchCaptcha = () => ({ type: AT.FETCH_CAPTCHA })

export const fetchCaptchaSuccess = (data) => ({ type: AT.FETCH_CAPTCHA_SUCCESS, payload: data })

export const fetchCaptchaFailure = (error) => ({ type: AT.FETCH_CAPTCHA_FAILURE, payload: error })

export const fetchLogs = () => ({ type: AT.FETCH_LOGS })

export const fetchLogsSuccess = (data) => ({ type: AT.FETCH_LOGS_SUCCESS, payload: data })

export const fetchLogsFailure = (error) => ({ type: AT.FETCH_LOGS_FAILURE, payload: error })

export const fetchPriceIndexSeries = (coin, start, scale) => ({ type: AT.FETCH_PRICE_INDEX_SERIES, payload: { coin, start, scale } })

export const fetchPriceIndexSeriesSuccess = (data) => ({ type: AT.FETCH_PRICE_INDEX_SERIES_SUCCESS, payload: data })

export const fetchPriceIndexSeriesFailure = (error) => ({ type: AT.FETCH_PRICE_INDEX_SERIES_FAILURE, payload: error })
