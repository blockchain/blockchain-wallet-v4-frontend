import * as AT from './actionTypes'

export const setBtcEth = (data) => ({ type: AT.SET_BTC_ETH, payload: data })

export const setEthBtc = (data) => ({ type: AT.SET_ETH_BTC, payload: data })

export const setOrder = (data) => ({ type: AT.SET_ORDER, payload: data })

export const getTradeStatus = (address) => ({ type: AT.GET_TRADE_STATUS, payload: { address } })

export const setTradeStatus = (data) => ({ type: AT.SET_TRADE_STATUS, payload: { data } })

export const getTradesStatus = (addresses) => ({ type: AT.GET_TRADES_STATUS, payload: { addresses } })
