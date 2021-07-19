import { AccountTokensBalancesResponseType } from 'core/types'

import * as AT from './actionTypes'

//
// ETH
//

// DATA
export const fetchData = () => ({ type: AT.FETCH_ETH_DATA })
export const fetchDataLoading = () => ({
  type: AT.FETCH_ETH_DATA_LOADING
})
export const fetchDataSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_ETH_DATA_SUCCESS
})
export const fetchDataFailure = (error) => ({
  payload: error,
  type: AT.FETCH_ETH_DATA_FAILURE
})

// FEES
export const fetchFee = () => ({ type: AT.FETCH_ETH_FEE })
export const fetchFeeLoading = () => ({ type: AT.FETCH_ETH_FEE_LOADING })
export const fetchFeeSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_ETH_FEE_SUCCESS
})
export const fetchFeeFailure = (error) => ({
  payload: error,
  type: AT.FETCH_ETH_FEE_FAILURE
})

// BLOCKS
export const fetchLatestBlock = () => ({
  type: AT.FETCH_ETH_LATEST_BLOCK
})
export const fetchLatestBlockLoading = () => ({
  type: AT.FETCH_ETH_LATEST_BLOCK_LOADING
})
export const fetchLatestBlockSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_ETH_LATEST_BLOCK_SUCCESS
})
export const fetchLatestBlockFailure = (error) => ({
  payload: error,
  type: AT.FETCH_ETH_LATEST_BLOCK_FAILURE
})

// BALANCES
export const fetchCurrentBalance = () => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE
})
export const fetchCurrentBalanceLoading = () => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE_LOADING
})
export const fetchCurrentBalanceSuccess = (balance) => ({
  payload: { balance },
  type: AT.FETCH_ETH_CURRENT_BALANCE_SUCCESS
})
export const fetchCurrentBalanceFailure = (error) => ({
  payload: error,
  type: AT.FETCH_ETH_CURRENT_BALANCE_FAILURE
})

// LEGACY BALANCES
export const fetchLegacyBalance = () => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE
})
export const fetchLegacyBalanceLoading = () => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE_LOADING
})
export const fetchLegacyBalanceSuccess = (balance) => ({
  payload: { balance },
  type: AT.FETCH_ETH_LEGACY_BALANCE_SUCCESS
})
export const fetchLegacyBalanceFailure = (error) => ({
  payload: error,
  type: AT.FETCH_ETH_LEGACY_BALANCE_FAILURE
})

// RATES
export const fetchRates = () => ({ type: AT.FETCH_ETH_RATES })
export const fetchRatesLoading = () => ({
  type: AT.FETCH_ETH_RATES_LOADING
})
export const fetchRatesSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_ETH_RATES_SUCCESS
})
export const fetchRatesFailure = (error) => ({
  payload: error,
  type: AT.FETCH_ETH_RATES_FAILURE
})

// TRANSACTIONS
export const fetchTransactions = (address?: string | null, reset?: boolean) => ({
  payload: { address, reset },
  type: AT.FETCH_ETH_TRANSACTIONS
})
export const fetchTransactionsLoading = (reset) => ({
  payload: { reset },
  type: AT.FETCH_ETH_TRANSACTIONS_LOADING
})
export const fetchTransactionsSuccess = (transactions, reset) => ({
  payload: { reset, transactions },
  type: AT.FETCH_ETH_TRANSACTIONS_SUCCESS
})
export const fetchTransactionsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_ETH_TRANSACTIONS_FAILURE
})
export const transactionsAtBound = (payload) => ({
  payload,
  type: AT.ETH_TRANSACTIONS_AT_BOUND
})

// TRANSACTION HISTORY
export const fetchTransactionHistory = (address, startDate, endDate) => ({
  payload: { address, endDate, startDate },
  type: AT.FETCH_ETH_TRANSACTION_HISTORY
})
export const fetchTransactionHistoryLoading = () => ({
  type: AT.FETCH_ETH_TRANSACTION_HISTORY_LOADING
})
export const fetchTransactionHistorySuccess = (data) => ({
  payload: data,
  type: AT.FETCH_ETH_TRANSACTION_HISTORY_SUCCESS
})
export const fetchTransactionHistoryFailure = (error) => ({
  payload: error,
  type: AT.FETCH_ETH_TRANSACTION_HISTORY_FAILURE
})
export const clearTransactionHistory = () => ({
  type: AT.CLEAR_ETH_TRANSACTION_HISTORY
})

// LOW BALANCE
export const checkLowEthBalance = () => ({
  type: AT.CHECK_LOW_ETH_BALANCE
})
export const checkLowEthBalanceSuccess = (payload) => ({
  payload,
  type: AT.CHECK_LOW_ETH_BALANCE_SUCCESS
})

//
// ERC20
//

// DATA
export const fetchErc20Data = (coin?: string) => ({
  payload: {
    coin
  },
  type: AT.FETCH_ERC20_TOKEN_DATA
})
export const fetchErc20DataLoading = (token) => ({
  payload: { token },
  type: AT.FETCH_ERC20_TOKEN_DATA_LOADING
})
export const fetchErc20DataSuccess = (token, data) => ({
  payload: { data, token },
  type: AT.FETCH_ERC20_TOKEN_DATA_SUCCESS
})
export const fetchErc20DataFailure = (token, error) => ({
  payload: { error, token },
  type: AT.FETCH_ERC20_TOKEN_DATA_FAILURE
})

// RATES
export const fetchErc20Rates = () => ({
  type: AT.FETCH_ERC20_RATES
})
export const fetchErc20RatesLoading = (token) => ({
  payload: { token },
  type: AT.FETCH_ERC20_RATES_LOADING
})
export const fetchErc20RatesSuccess = (token, data) => ({
  payload: { data, token },
  type: AT.FETCH_ERC20_RATES_SUCCESS
})
export const fetchErc20RatesFailure = (token, error) => ({
  payload: { error, token },
  type: AT.FETCH_ERC20_RATES_FAILURE
})

// TX FEES
export const fetchErc20TxFee = (hash, token) => ({
  payload: { hash, token },
  type: AT.FETCH_ERC20_TX_FEE
})
export const fetchErc20TxFeeLoading = (hash, token) => ({
  payload: { hash, token },
  type: AT.FETCH_ERC20_TX_FEE_LOADING
})
export const fetchErc20TxFeeSuccess = (fee, hash, token) => ({
  payload: { fee, hash, token },
  type: AT.FETCH_ERC20_TX_FEE_SUCCESS
})
export const fetchErc20TxFeeFailure = (hash, token, error) => ({
  payload: { error, hash, token },
  type: AT.FETCH_ERC20_TX_FEE_FAILURE
})

// BALANCES
export const fetchErc20Balance = (token) => ({
  payload: { token },
  type: AT.FETCH_ERC20_TOKEN_BALANCE
})
export const fetchErc20BalanceLoading = (token) => ({
  payload: { token },
  type: AT.FETCH_ERC20_TOKEN_BALANCE_LOADING
})
export const fetchErc20BalanceSuccess = (token, balance) => ({
  payload: { balance, token },
  type: AT.FETCH_ERC20_TOKEN_BALANCE_SUCCESS
})
export const fetchErc20BalanceFailure = (token, error) => ({
  payload: { error, token },
  type: AT.FETCH_ERC20_TOKEN_BALANCE_FAILURE
})

// TRANSACTIONS
export const fetchErc20Transactions = (token, reset) => ({
  payload: { reset, token },
  type: AT.FETCH_ERC20_TOKEN_TRANSACTIONS
})
export const fetchErc20TransactionsLoading = (token, reset) => ({
  payload: { reset, token },
  type: AT.FETCH_ERC20_TOKEN_TRANSACTIONS_LOADING
})
export const fetchErc20TransactionsSuccess = (token, transactions, reset) => ({
  payload: { reset, token, transactions },
  type: AT.FETCH_ERC20_TOKEN_TRANSACTIONS_SUCCESS
})
export const fetchErc20TransactionsFailure = (token, error) => ({
  payload: { error, token },
  type: AT.FETCH_ERC20_TOKEN_TRANSACTIONS_FAILURE
})
export const erc20TransactionsAtBound = (token, isAtBound) => ({
  payload: { isAtBound, token },
  type: AT.ERC20_TOKEN_TX_AT_BOUND
})

// TRANSACTION HISTORY
export const fetchErc20TransactionHistory = (address, startDate, endDate, token) => ({
  payload: { address, endDate, startDate, token },
  type: AT.FETCH_ERC20_TRANSACTION_HISTORY
})
export const fetchErc20TransactionHistoryLoading = (token) => ({
  payload: { token },
  type: AT.FETCH_ERC20_TRANSACTION_HISTORY_LOADING
})
export const fetchErc20TransactionHistorySuccess = (txList, token) => ({
  payload: { token, txList },
  type: AT.FETCH_ERC20_TRANSACTION_HISTORY_SUCCESS
})
export const fetchErc20TransactionHistoryFailure = (error, token) => ({
  payload: { error, token },
  type: AT.FETCH_ERC20_TRANSACTION_HISTORY_FAILURE
})
export const clearErc20TransactionHistory = (token) => ({
  payload: { token },
  type: AT.CLEAR_ERC20_TRANSACTION_HISTORY
})

// ERC20s w/ BALANCE
export const fetchErc20AccountTokenBalances = () => ({
  type: AT.FETCH_ERC20_ACCOUNT_TOKEN_BALANCES
})
export const fetchErc20AccountTokenBalancesLoading = () => ({
  type: AT.FETCH_ERC20_ACCOUNT_TOKEN_BALANCES_LOADING
})
export const fetchErc20AccountTokenBalancesSuccess = (
  data: AccountTokensBalancesResponseType['tokenAccounts']
) => ({
  payload: { data },
  type: AT.FETCH_ERC20_ACCOUNT_TOKEN_BALANCES_SUCCESS
})
export const fetchErc20AccountTokenBalancesFailure = (error) => ({
  payload: { error },
  type: AT.FETCH_ERC20_ACCOUNT_TOKEN_BALANCES_FAILURE
})
