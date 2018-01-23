import * as AT from './actionTypes'

export const sendEther = (from, to, amount, fee) => ({ type: AT.SEND_ETHER, payload: { from, to, amount, fee } })
