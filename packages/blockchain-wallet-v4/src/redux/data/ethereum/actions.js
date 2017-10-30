import * as AT from './actionTypes'

export const setEtherBalance = (balance) => ({ type: AT.SET_ETHER_BALANCE, payload: { balance } })

export const setEthereumRates = (data) => ({ type: AT.SET_ETHEREUM_RATES, payload: data })

export const setEthereumTransactions = (address, txs) => ({ type: AT.SET_ETHEREUM_TRANSACTIONS, payload: { address, txs } })
