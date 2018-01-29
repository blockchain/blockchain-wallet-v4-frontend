import * as AT from './actionTypes'

export const sendEther = (network, data) => ({ type: AT.SEND_ETHER, payload: { network, data } })
