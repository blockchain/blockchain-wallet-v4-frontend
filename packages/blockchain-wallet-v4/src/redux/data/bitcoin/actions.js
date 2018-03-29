// @flow
import * as AT from './actionTypes'

export const setBitcoinLatestBlock = (block_index: number, hash: any, height: number, time: number) =>
  ({ type: AT.SET_BITCOIN_LATEST_BLOCK, payload: { block_index, hash, height, time } })

// FETCH_BITCOIN_DATA
export const fetchData = (context: any) => ({ type: AT.FETCH_BITCOIN_DATA, payload: { context } })
export const fetchDataLoading = () => ({ type: AT.FETCH_BITCOIN_DATA_LOADING, payload: {} })
export const fetchDataSuccess = (data: any) => ({ type: AT.FETCH_BITCOIN_DATA_SUCCESS, payload: data })
export const fetchDataFailure = (error: any) => ({ type: AT.FETCH_BITCOIN_DATA_FAILURE, payload: error })

// FETCH_BITCOIN_FEE
export const fetchFee = () => ({ type: AT.FETCH_BITCOIN_FEE, payload: {} })
export const fetchFeeLoading = () => ({ type: AT.FETCH_BITCOIN_FEE_LOADING, payload: {} })
export const fetchFeeSuccess = (data: any) => ({ type: AT.FETCH_BITCOIN_FEE_SUCCESS, payload: data })
export const fetchFeeFailure = (error: any) => ({ type: AT.FETCH_BITCOIN_FEE_FAILURE, payload: error })

// FETCH_BITCOIN_FIAT_AT_TIME
export const fetchFiatAtTime = (hash: any, amount: number, time: number, currency: string) =>
  ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME, payload: {hash, amount, time, currency} })
export const fetchFiatAtTimeLoading = (hash: any, currency: string) =>
  ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_LOADING, payload: { hash, currency } })
export const fetchFiatAtTimeSuccess = (hash: any, currency: string, data: any) =>
  ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_SUCCESS, payload: { hash, currency, data } })
export const fetchFiatAtTimeFailure = (hash: any, currency: string, error: string) =>
  ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_FAILURE, payload: { hash, currency, error } })

// FETCH_BITCOIN_RATES
export const fetchRates = () => ({ type: AT.FETCH_BITCOIN_RATES, payload: {} })
export const fetchRatesLoading = () => ({ type: AT.FETCH_BITCOIN_RATES_LOADING, payload: {} })
export const fetchRatesSuccess = (data: any) => ({ type: AT.FETCH_BITCOIN_RATES_SUCCESS, payload: data })
export const fetchRatesFailure = (error: any) => ({ type: AT.FETCH_BITCOIN_RATES_FAILURE, payload: error })

// FETCH_BITCOIN_TRANSACTIONS
export const fetchTransactions = (address: string, reset: boolean) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS, payload: { address, reset } })
export const fetchTransactionsLoading = (reset: boolean) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_LOADING, payload: { reset } })
export const fetchTransactionsSuccess = (transactions: any, reset: boolean) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_SUCCESS, payload: {transactions, reset} })
export const fetchTransactionsFailure = (error: any) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_FAILURE, payload: error })

// FETCH_BITCOIN_TRANSACTION_HISTORY
export const fetchTransactionHistory = (address: string, start: number, end: number) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY, payload: { address, start, end } })
export const fetchTransactionHistoryLoading = () => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_LOADING, payload: {} })
export const fetchTransactionHistorySuccess = (data: any) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_SUCCESS, payload: data })
export const fetchTransactionHistoryFailure = (error: any) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_FAILURE, payload: error })

// FETCH_BITCOIN_UNSPENT
export const fetchUnspent = (source: any) => ({ type: AT.FETCH_BITCOIN_UNSPENT, payload: { source } })
export const fetchUnspentLoading = () => ({ type: AT.FETCH_BITCOIN_UNSPENT_LOADING, payload: {} })
export const fetchUnspentSuccess = (data: any) => ({ type: AT.FETCH_BITCOIN_UNSPENT_SUCCESS, payload: data })
export const fetchUnspentFailure = (error: any) => ({ type: AT.FETCH_BITCOIN_UNSPENT_FAILURE, payload: error })

// PUBLISH_BITCOIN_TRANSACTION
export const publishTransaction = () => ({ type: AT.PUBLISH_BITCOIN_TRANSACTION, payload: {} })

// REFRESH_BITCOIN_EFFECTIVE_BALANCE
export const refreshEffectiveBalance = (coins: any, feePerByte: number) => {
  return { type: AT.REFRESH_BITCOIN_EFFECTIVE_BALANCE, payload: { coins, feePerByte } }
}

// REFRESH_BITCOIN_SELECTION
const REFRESH_BITCOIN_SELECTION = '@CORE.REFRESH_BITCOIN_SELECTION'
export function refreshSelection (feePerByte: number, coins: any[], amount: number, receive: string, change: any, algorithm: string, seed: any) {
  return { type: '@CORE.REFRESH_BITCOIN_SELECTION', payload: { feePerByte, coins, amount, receive, change, algorithm, seed } }
}
