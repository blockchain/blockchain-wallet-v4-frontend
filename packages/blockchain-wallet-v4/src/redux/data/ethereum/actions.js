import * as AT from './actionTypes'

// export const setEthereumTransactions = (address, txs) => ({ type: AT.SET_ETHEREUM_TRANSACTIONS, payload: { address, txs } })

// FETCH_ETHEREUM_DATA
export const fetchData = (context) => ({ type: AT.FETCH_ETHEREUM_DATA, payload: { context } })
export const fetchDataLoading = () => ({ type: AT.FETCH_ETHEREUM_DATA_LOADING })
export const fetchDataSuccess = (data) => ({ type: AT.FETCH_ETHEREUM_DATA_SUCCESS, payload: data })
export const fetchDataFailure = (error) => ({ type: AT.FETCH_ETHEREUM_DATA_FAILURE, payload: error })

// FETCH_ETHEREUM_FEE
export const fetchFee = () => ({ type: AT.FETCH_ETHEREUM_FEE })
export const fetchFeeLoading = () => ({ type: AT.FETCH_ETHEREUM_FEE_LOADING })
export const fetchFeeSuccess = (data) => ({ type: AT.FETCH_ETHEREUM_FEE_SUCCESS, payload: data })
export const fetchFeeFailure = (error) => ({ type: AT.FETCH_ETHEREUM_FEE_FAILURE, payload: error })

// FETCH_ETHEREUM_LATEST_BLOCK
export const fetchLatestBlock = () => ({ type: AT.FETCH_ETHEREUM_LATEST_BLOCK })
export const fetchLatestBlockLoading = () => ({ type: AT.FETCH_ETHEREUM_LATEST_BLOCK_LOADING })
export const fetchLatestBlockSuccess = (data) => ({ type: AT.FETCH_ETHEREUM_LATEST_BLOCK_SUCCESS, payload: data })
export const fetchLatestBlockFailure = (error) => ({ type: AT.FETCH_ETHEREUM_LATEST_BLOCK_FAILURE, payload: error })

// FETCH_ETHEREUM_RATES
export const fetchRates = () => ({ type: AT.FETCH_ETHEREUM_RATES })
export const fetchRatesLoading = () => ({ type: AT.FETCH_ETHEREUM_RATES_LOADING })
export const fetchRatesSuccess = (data) => ({ type: AT.FETCH_ETHEREUM_RATES_SUCCESS, payload: data })
export const fetchRatesFailure = (error) => ({ type: AT.FETCH_ETHEREUM_RATES_FAILURE, payload: error })

// FETCH_ETHEREUM_TRANSACTIONS
export const fetchTransactions = () => ({ type: AT.FETCH_ETHEREUM_TRANSACTIONS_RATES })
export const fetchTransactionsLoading = () => ({ type: AT.FETCH_ETHEREUM_TRANSACTIONS_RATES_LOADING })
export const fetchTransactionsSuccess = (data) => ({ type: AT.FETCH_ETHEREUM_TRANSACTIONS_SUCCESS, payload: data })
export const fetchTransactionsFailure = (error) => ({ type: AT.FETCH_ETHEREUM_TRANSACTIONS_FAILURE, payload: error })
