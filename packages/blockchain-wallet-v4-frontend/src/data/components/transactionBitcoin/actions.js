import * as AT from './actionTypes'

export const initBitcoinTransactions = (address) => ({ type: AT.INIT_BITCOIN_TRANSACTIONS, payload: { address } })

export const getBitcoinFiatAtTime = (coin, hash, amount, time) => ({ type: AT.GET_BITCOIN_FIAT_AT_TIME, payload: { coin, hash, amount, time } })
