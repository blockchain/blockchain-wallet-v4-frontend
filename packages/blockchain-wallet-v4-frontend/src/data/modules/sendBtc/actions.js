import * as AT from './actionTypes'

export const sendBtc = (selection) => ({ type: AT.SEND_BTC, payload: { selection } })
