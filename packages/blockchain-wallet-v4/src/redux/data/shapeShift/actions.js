import * as AT from './actionTypes'

export const setBtcEth = (data) => ({ type: AT.SET_BTC_ETH, payload: data })
export const setEthBtc = (data) => ({ type: AT.SET_ETH_BTC, payload: data })
export const setOrder = (data) => ({ type: AT.SET_ORDER, payload: data })
export const getTradeStatus = (address) => ({ type: AT.GET_TRADE_STATUS, payload: { address } })
export const setTradeStatus = (data) => ({ type: AT.SET_TRADE_STATUS, payload: { data } })
export const getTradesStatus = (addresses) => ({ type: AT.GET_TRADES_STATUS, payload: { addresses } })

// FETCH_BTC-ETH
export const fetchBtcEth = () => ({ type: AT.FETCH_BTC_ETH })
export const fetchBtcEthLoading = () => ({ type: AT.FETCH_BTC_ETH_LOADING })
export const fetchBtcEthSuccess = (data) => ({ type: AT.FETCH_BTC_ETH_SUCCESS, payload: data })
export const fetchBtcEthFailure = (error) => ({ type: AT.FETCH_BTC_ETH_FAILURE, payload: error })

// FETCH_ETH_BTC
export const fetchEthBtc = () => ({ type: AT.FETCH_ETH_BTC })
export const fetchEthBtcLoading = () => ({ type: AT.FETCH_ETH_BTC_LOADING })
export const fetchEthBtcSuccess = (data) => ({ type: AT.FETCH_ETH_BTC_SUCCESS, payload: data })
export const fetchEthBtcFailure = (error) => ({ type: AT.FETCH_ETH_BTC_FAILURE, payload: error })

// FETCH_TRADES_STATUSES
export const fetchTradesStatuses = (addresses) => ({ type: AT.FETCH_TRADES_STATUSES, payload: { addresses } })
export const fetchTradesStatusesLoading = () => ({ type: AT.FETCH_TRADES_STATUSES_LOADING })
export const fetchTradesStatusesSuccess = (data) => ({ type: AT.FETCH_TRADES_STATUSES_SUCCESS, payload: data })
export const fetchTradesStatusesFailure = (error) => ({ type: AT.FETCH_TRADES_STATUSES_FAILURE, payload: error })
