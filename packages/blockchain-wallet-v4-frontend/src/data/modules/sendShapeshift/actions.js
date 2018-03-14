import * as AT from './actionTypes'

export const sendShapeshiftDeposit = (coin, payment, order) => ({ type: AT.SEND_SHAPESHIFT_DEPOSIT, payload: { coin, payment, order } })

export const refreshShapeshiftTrades = () => ({ type: AT.REFRESH_SHAPESHIFT_TRADES })

export const cancelRefreshShapeshiftTrades = () => ({ type: AT.CANCEL_REFRESH_SHAPESHIFT_TRADES })
