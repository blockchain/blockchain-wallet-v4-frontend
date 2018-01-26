import * as AT from './actionTypes'

export const sendBitcoin = (selection) => ({ type: AT.SEND_BITCOIN, payload: { selection } })
