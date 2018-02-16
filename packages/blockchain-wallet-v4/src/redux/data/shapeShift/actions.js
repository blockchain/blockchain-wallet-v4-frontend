import * as AT from './actionTypes'

export const setBtcEth = (data) => ({ type: AT.SET_BTC_ETH, payload: data })
export const setEthBtc = (data) => ({ type: AT.SET_ETH_BTC, payload: data })
export const setOrder = (data) => ({ type: AT.SET_ORDER, payload: data })
export const getTradeStatus = (address) => ({ type: AT.GET_TRADE_STATUS, payload: { address } })
export const setTradeStatus = (data) => ({ type: AT.SET_TRADE_STATUS, payload: { data } })
export const getTradesStatus = (addresses) => ({ type: AT.GET_TRADES_STATUS, payload: { addresses } })

// FETCH_BTC_ETH
export const fetchBtcEth = () => ({ type: AT.FETCH_BTC_ETH })
export const fetchBtcEthLoading = () => ({ type: AT.FETCH_BTC_ETH_LOADING })
export const fetchBtcEthSuccess = (data) => ({ type: AT.FETCH_BTC_ETH_SUCCESS, payload: data })
export const fetchBtcEthFailure = (error) => ({ type: AT.FETCH_BTC_ETH_FAILURE, payload: error })

// FETCH_ETH_BTC
export const fetchEthBtc = () => ({ type: AT.FETCH_ETH_BTC })
export const fetchEthBtcLoading = () => ({ type: AT.FETCH_ETH_BTC_LOADING })
export const fetchEthBtcSuccess = (data) => ({ type: AT.FETCH_ETH_BTC_SUCCESS, payload: data })
export const fetchEthBtcFailure = (error) => ({ type: AT.FETCH_ETH_BTC_FAILURE, payload: error })

// FETCH_TRADE_STATUS
export const fetchTradeStatus = (address) => ({ type: AT.FETCH_TRADE_STATUS, payload: { address } })
export const fetchTradeStatusLoading = (address) => ({ type: AT.FETCH_TRADE_STATUS_LOADING, payload: { address } })
export const fetchTradeStatusSuccess = (data, address) => ({ type: AT.FETCH_TRADE_STATUS_SUCCESS, payload: { data, address } })
export const fetchTradeStatusFailure = (error, address) => ({ type: AT.FETCH_TRADE_STATUS_FAILURE, payload: { error, address } })

// FETCH_SHAPESHIFT_QUOTATION
export const fetchShapeshiftQuotation = () => ({ type: AT.FETCH_SHAPESHIFT_QUOTATION })
export const fetchShapeshiftQuotationLoading = () => ({ type: AT.FETCH_SHAPESHIFT_QUOTATION_LOADING })
export const fetchShapeshiftQuotationSuccess = (data) => ({ type: AT.FETCH_SHAPESHIFT_QUOTATION_SUCCESS, payload: data })
export const fetchShapeshiftQuotationFailure = (error) => ({ type: AT.FETCH_SHAPESHIFT_QUOTATION_FAILURE, payload: error })

// FETCH_SHAPESHIFT_ORDER
export const fetchShapeshiftOrder = () => ({ type: AT.FETCH_SHAPESHIFT_ORDER })
export const fetchShapeshiftOrderLoading = () => ({ type: AT.FETCH_SHAPESHIFT_ORDER_LOADING })
export const fetchShapeshiftOrderSuccess = (data) => ({ type: AT.FETCH_SHAPESHIFT_ORDER_SUCCESS, payload: data })
export const fetchShapeshiftOrderFailure = (error) => ({ type: AT.FETCH_SHAPESHIFT_ORDER_FAILURE, payload: error })
