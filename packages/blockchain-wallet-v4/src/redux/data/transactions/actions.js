import * as T from './actionTypes'

export const setTransactions = (address, txs, reset) => ({ type: T.SET_TRANSACTIONS, payload: { address, txs, reset } })
