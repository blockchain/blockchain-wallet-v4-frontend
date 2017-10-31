import * as AT from './actionTypes'

export const setAdverts = (data) => ({ type: AT.SET_ADVERTS, payload: data })

export const setCaptcha = (url, sessionToken) => ({ type: AT.SET_CAPTCHA, payload: { url, sessionToken } })

export const deleteCaptcha = () => ({ type: AT.DELETE_CAPTCHA })

export const setPriceIndexSeries = (data) => ({ type: AT.SET_PRICE_INDEX_SERIES, payload: { data } })

export const setLogs = (data) => ({ type: AT.SET_LOGS, payload: data })

export const setTransactionHistory = (data) => ({ type: AT.SET_TRANSACTION_HISTORY, payload: { data } })
