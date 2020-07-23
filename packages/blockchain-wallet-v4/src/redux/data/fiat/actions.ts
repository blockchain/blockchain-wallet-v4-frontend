import * as AT from './actionTypes'
import { FiatActionTypes } from './types'
import { SBTransactionsType, WalletFiatType } from 'core/types'

// FETCH_FIAT_TRANSACTIONS
export const fetchTransactions = (
  currency: WalletFiatType,
  reset?: boolean
) => ({
  type: AT.FETCH_FIAT_TRANSACTIONS,
  payload: { currency, reset }
})
export const fetchTransactionsFailure = (
  currency: WalletFiatType,
  error
): FiatActionTypes => ({
  type: AT.FETCH_FIAT_TRANSACTIONS_FAILURE,
  payload: { currency, error }
})
export const fetchTransactionsLoading = (
  currency: WalletFiatType,
  reset: boolean
): FiatActionTypes => ({
  type: AT.FETCH_FIAT_TRANSACTIONS_LOADING,
  payload: { currency, reset }
})
export const fetchTransactionsSuccess = (
  currency: WalletFiatType,
  response: SBTransactionsType,
  reset?: boolean
): FiatActionTypes => ({
  type: AT.FETCH_FIAT_TRANSACTIONS_SUCCESS,
  payload: { currency, response, reset }
})
export const transactionsAtBound = (
  currency: WalletFiatType,
  isAtBound: boolean
) => ({
  type: AT.FIAT_TRANSACTIONS_AT_BOUND,
  payload: {
    currency,
    isAtBound
  }
})
