import * as AT from './actionTypes'

export const initSendEther = () => ({ type: AT.INIT_SEND_ETHER })

export const initTransferEther = (balance) => ({ type: AT.INIT_TRANSFER_ETHER, payload: { balance } })
