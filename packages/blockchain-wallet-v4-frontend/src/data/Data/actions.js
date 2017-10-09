import * as AT from './actionTypes'

export const initData = () => ({ type: AT.INIT_DATA })

export const getAdverts = (number) => ({ type: AT.GET_ADVERTS, payload: { number } })

export const getCaptcha = () => ({ type: AT.GET_CAPTCHA })

export const getPriceIndexSeries = (coin, currency, start, scale) => ({ type: AT.GET_PRICE_INDEX_SERIES, payload: { coin, currency, start, scale } })

export const getLogs = () => ({ type: AT.GET_LOGS })

export const getTransactions = (address) => ({ type: AT.GET_TRANSACTIONS, payload: { address } })
