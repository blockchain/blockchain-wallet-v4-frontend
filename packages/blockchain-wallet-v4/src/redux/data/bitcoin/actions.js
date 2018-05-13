import * as AT from './actionTypes'

export const setBitcoinLatestBlock = (block_index, hash, height, time) => ({ type: AT.SET_BITCOIN_LATEST_BLOCK, payload: { block_index, hash, height, time } })

// FETCH_BITCOIN_DATA
export const fetchData = (context) => ({ type: AT.FETCH_BITCOIN_DATA, payload: { context } })
export const fetchDataLoading = () => ({ type: AT.FETCH_BITCOIN_DATA_LOADING })
export const fetchDataSuccess = (data) => ({ type: AT.FETCH_BITCOIN_DATA_SUCCESS, payload: data })
export const fetchDataFailure = (error) => ({ type: AT.FETCH_BITCOIN_DATA_FAILURE, payload: error })

// FETCH_BITCOIN_FEE
export const fetchFee = () => ({ type: AT.FETCH_BITCOIN_FEE })
export const fetchFeeLoading = () => ({ type: AT.FETCH_BITCOIN_FEE_LOADING })
export const fetchFeeSuccess = (data) => ({ type: AT.FETCH_BITCOIN_FEE_SUCCESS, payload: data })
export const fetchFeeFailure = (error) => ({ type: AT.FETCH_BITCOIN_FEE_FAILURE, payload: error })

// FETCH_BITCOIN_FIAT_AT_TIME
export const fetchFiatAtTime = (hash, amount, time, currency) => ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME, payload: {hash, amount, time, currency} })
export const fetchFiatAtTimeLoading = (hash, currency) => ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_LOADING, payload: { hash, currency } })
export const fetchFiatAtTimeSuccess = (hash, currency, data) => ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_SUCCESS, payload: { hash, currency, data } })
export const fetchFiatAtTimeFailure = (hash, currency, error) => ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_FAILURE, payload: { hash, currency, error } })

// FETCH_BITCOIN_RATES
export const fetchRates = () => ({ type: AT.FETCH_BITCOIN_RATES })
export const fetchRatesLoading = () => ({ type: AT.FETCH_BITCOIN_RATES_LOADING })
export const fetchRatesSuccess = (data) => ({ type: AT.FETCH_BITCOIN_RATES_SUCCESS, payload: data })
export const fetchRatesFailure = (error) => ({ type: AT.FETCH_BITCOIN_RATES_FAILURE, payload: error })

// FETCH_BITCOIN_TRANSACTIONS
export const fetchTransactions = (address, reset) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS, payload: { address, reset } })
export const fetchTransactionsLoading = (reset) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_LOADING, payload: { reset } })
export const fetchTransactionsSuccess = (transactions, reset) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_SUCCESS, payload: {transactions, reset} })
export const fetchTransactionsFailure = (error) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_FAILURE, payload: error })

// FETCH_BITCOIN_TRANSACTION_HISTORY
export const fetchTransactionHistory = (address, start, end) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY, payload: { address, start, end } })
export const fetchTransactionHistoryLoading = () => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_LOADING })
export const fetchTransactionHistorySuccess = (data) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_SUCCESS, payload: data })
export const fetchTransactionHistoryFailure = (error) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_FAILURE, payload: error })
