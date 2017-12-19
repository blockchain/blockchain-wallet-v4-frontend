import * as AT from './actionTypes'

export const setEthereumFee = (data) => ({ type: AT.SET_ETHEREUM_FEE, payload: { data } })

export const setEthereumRates = (data) => ({ type: AT.SET_ETHEREUM_RATES, payload: { data } })

export const setEthereumTransactions = (address, txs) => ({ type: AT.SET_ETHEREUM_TRANSACTIONS, payload: { address, txs } })

export const setEthereumLatestBlock = (data) => ({ type: AT.SET_ETHEREUM_LATEST_BLOCK, payload: { data } })


export const fetchRates = () => ({ type: AT.FETCH_ETHEREUM_RATES })

export const fetchRatesSuccess = (data) => ({ type: AT.FETCH_ETHEREUM_RATES_SUCCESS, payload: data })

export const fetchRatesFailure = (error) => ({ type: AT.FETCH_ETHEREUM_RATES_FAILURE, payload: error })
