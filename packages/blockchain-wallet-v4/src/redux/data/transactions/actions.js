import * as T from './actionTypes'

export const setBitcoinTransactions = (address, txs, reset) => ({ type: T.SET_BITCOIN_TRANSACTIONS, payload: { address, txs, reset } })

export const setEthereumTransactions = (address, txs) => ({ type: T.SET_ETHEREUM_TRANSACTIONS, payload: { address, txs } })
