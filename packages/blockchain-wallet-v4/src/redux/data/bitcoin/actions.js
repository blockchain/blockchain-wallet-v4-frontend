import * as AT from './actionTypes'

// export const setBitcoinLatestBlock = (block_index, hash, height, time) => ({ type: AT.SET_BITCOIN_LATEST_BLOCK, payload: { block_index, hash, height, time } })

// export const setBitcoinEffectiveBalance = (effectiveBalance) => ({ type: AT.SET_BITCOIN_EFFECTIVE_BALANCE, payload: { effectiveBalance } })

// export const setBitcoinSelection = (feePerByte, target, coins, change, algorithm, seed) => ({ type: AT.SET_BITCOIN_SELECTION, payload: { feePerByte, target, coins, change, algorithm, seed } })

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
export const fetchFiat = () => ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME })
export const fetchFiatLoading = () => ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_LOADING })
export const fetchFiatSuccess = (data) => ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_SUCCESS, payload: data })
export const fetchFiatFailure = (error) => ({ type: AT.FETCH_BITCOIN_FIAT_AT_TIME_FAILURE, payload: error })

// FETCH_BITCOIN_RATES
export const fetchRates = () => ({ type: AT.FETCH_BITCOIN_RATES })
export const fetchRatesLoading = () => ({ type: AT.FETCH_BITCOIN_RATES_LOADING })
export const fetchRatesSuccess = (data) => ({ type: AT.FETCH_BITCOIN_RATES_SUCCESS, payload: data })
export const fetchRatesFailure = (error) => ({ type: AT.FETCH_BITCOIN_RATES_FAILURE, payload: error })

// FETCH_BITCOIN_SELECTION
export const fetchSelection = () => ({ type: AT.FETCH_BITCOIN_SELECTION })
export const fetchSelectionLoading = () => ({ type: AT.FETCH_BITCOIN_SELECTION_LOADING })
export const fetchSelectionSuccess = (data) => ({ type: AT.FETCH_BITCOIN_SELECTION_SUCCESS, payload: data })
export const fetchSelectionFailure = (error) => ({ type: AT.FETCH_BITCOIN_SELECTION_FAILURE, payload: error })

// FETCH_BITCOIN_TRANSACTIONS
export const fetchTransactions = (address, reset) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS, payload: { address, reset } })
export const fetchTransactionsLoading = () => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_LOADING })
export const fetchTransactionsSuccess = (data) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_SUCCESS, payload: data })
export const fetchTransactionsFailure = (error) => ({ type: AT.FETCH_BITCOIN_TRANSACTIONS_FAILURE, payload: error })

// FETCH_BITCOIN_TRANSACTION_HISTORY
export const fetchTransactionHistory = (address, start, end) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY, payload: { address, start, end } })
export const fetchTransactionHistoryLoading = () => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_LOADING })
export const fetchTransactionHistorySuccess = (data) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_SUCCESS, payload: data })
export const fetchTransactionHistoryFailure = (error) => ({ type: AT.FETCH_BITCOIN_TRANSACTION_HISTORY_FAILURE, payload: error })

// FETCH_BITCOIN_UNSPENT
export const fetchUnspent = () => ({ type: AT.FETCH_BITCOIN_UNSPENT })
export const fetchUnspentLoading = () => ({ type: AT.FETCH_BITCOIN_UNSPENT_LOADING })
export const fetchUnspentSuccess = (data) => ({ type: AT.FETCH_BITCOIN_UNSPENT_SUCCESS, payload: data })
export const fetchUnspentFailure = (error) => ({ type: AT.FETCH_BITCOIN_UNSPENT_FAILURE, payload: error })

// PUBLISH_BITCOIN_TRANSACTION
export const publishTransaction = () => ({ type: AT.PUBLISH_BITCOIN_TRANSACTION })
