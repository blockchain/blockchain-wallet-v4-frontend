import * as AT from './actionTypes'

export const initExchangeHistory = (addresses) => ({ type: AT.INIT_EXCHANGE_HISTORY, payload: { addresses } })
