import * as AT from './actionTypes'

export const initTransferEther = (balance) => ({ type: AT.INIT_TRANSFER_ETHER, payload: { balance } })

export const transferEther = () => ({ type: AT.TRANSFER_ETHER })
