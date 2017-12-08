import * as AT from './actionTypes'

export const initEtherTransactions = (address) => ({ type: AT.INIT_ETHER_TRANSACTIONS, payload: { address } })
