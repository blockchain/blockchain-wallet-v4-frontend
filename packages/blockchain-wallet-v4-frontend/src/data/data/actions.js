import * as AT from './actionTypes'

export const getTransactionHistory = (address, start, end) => ({ type: AT.GET_TRANSACTION_HISTORY, payload: { address, start, end } })

export const getBtcEth = () => ({ type: AT.GET_BTC_ETH })

export const getEthBtc = () => ({ type: AT.GET_ETH_BTC })

export const getShapeshiftOrderStatuses = (addresses) => ({ type: AT.GET_SHAPESHIFT_ORDER_STATUSES, payload: { addresses } })
