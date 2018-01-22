import * as AT from './actionTypes'

export const initExchangeHistory = (page) => ({ type: AT.INIT_EXCHANGE_HISTORY, payload: { page } })
