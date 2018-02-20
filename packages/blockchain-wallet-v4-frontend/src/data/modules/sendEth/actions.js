import * as AT from './actionTypes'

export const sendEth = (network, data) => ({ type: AT.SEND_ETH, payload: { network, data } })
