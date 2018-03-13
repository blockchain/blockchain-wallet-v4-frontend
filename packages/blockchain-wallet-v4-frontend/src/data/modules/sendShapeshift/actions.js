import * as AT from './actionTypes'

export const sendShapeshiftDeposit = (coin, payment, order) => ({ type: AT.SEND_SHAPESHIFT_DEPOSIT, payload: { coin, payment, order } })
