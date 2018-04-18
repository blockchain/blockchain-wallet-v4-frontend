import * as AT from './actionTypes'

export const fetchTradeDetails = (trade) => ({ type: AT.FETCH_TRADE_DETAILS, payload: trade })
