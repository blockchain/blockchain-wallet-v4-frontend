import * as AT from './actionTypes'

export const initialized = (coin) => ({ type: AT.PRICE_TICKER_INITIALIZED, payload: { coin } })
