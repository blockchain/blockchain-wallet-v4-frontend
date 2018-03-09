import * as AT from './actionTypes'

export const sendShapeshiftDeposit = (coin, payment) => ({ type: AT.SEND_SHAPESHIFT_DEPOSIT, payload: { coin, payment } })
