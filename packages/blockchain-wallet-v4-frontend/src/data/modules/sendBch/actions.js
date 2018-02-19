import * as AT from './actionTypes'

export const sendBch = (selection) => ({ type: AT.SEND_BCH, payload: { selection } })
