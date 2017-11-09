import * as AT from './actionTypes'

export const initSendEther = () => ({ type: AT.INIT_SEND_ETHER })

export const initTransferEther = (balance) => ({ type: AT.INIT_TRANSFER_ETHER, payload: { balance } })

export const sendEther = (from, to, amount, fee) => ({ type: AT.SEND_ETHER, payload: { from, to, amount, fee } })

export const transferEther = (from, to, amount) => ({ type: AT.TRANSFER_ETHER, payload: { from, to, amount } })
