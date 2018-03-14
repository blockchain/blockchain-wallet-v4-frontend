import * as AT from './actionTypes'

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

// FETCH_SHAPESHIFT_QUOTATION
export const fetchQuotation = (amount, pair, isDeposit) => ({ type: AT.FETCH_SHAPESHIFT_QUOTATION, payload: { amount, pair, isDeposit } })
export const fetchQuotationLoading = () => ({ type: AT.FETCH_SHAPESHIFT_QUOTATION_LOADING })
export const fetchQuotationSuccess = (data) => ({ type: AT.FETCH_SHAPESHIFT_QUOTATION_SUCCESS, payload: data })
export const fetchQuotationFailure = (error) => ({ type: AT.FETCH_SHAPESHIFT_QUOTATION_FAILURE, payload: error })

// FETCH_SHAPESHIFT_ORDER
export const fetchOrder = (depositAmount, pair, returnAddress, withdrawal) => ({ type: AT.FETCH_SHAPESHIFT_ORDER, payload: { depositAmount, pair, returnAddress, withdrawal } })
export const fetchOrderLoading = () => ({ type: AT.FETCH_SHAPESHIFT_ORDER_LOADING })
export const fetchOrderSuccess = (data) => ({ type: AT.FETCH_SHAPESHIFT_ORDER_SUCCESS, payload: data })
export const fetchOrderFailure = (error) => ({ type: AT.FETCH_SHAPESHIFT_ORDER_FAILURE, payload: error })
