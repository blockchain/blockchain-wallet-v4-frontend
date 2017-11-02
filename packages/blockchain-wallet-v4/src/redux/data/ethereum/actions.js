import * as AT from './actionTypes'

export const setEthereumBalance = (balance) => ({ type: AT.SET_ETHEREUM_BALANCE, payload: { balance } })

export const setEthereumFee = (data) => ({ type: AT.SET_ETHEREUM_FEE, payload: data })

export const setEthereumRates = (data) => ({ type: AT.SET_ETHEREUM_RATES, payload: data })

export const setEthereumTransactions = (address, txs) => ({ type: AT.SET_ETHEREUM_TRANSACTIONS, payload: { address, txs } })
