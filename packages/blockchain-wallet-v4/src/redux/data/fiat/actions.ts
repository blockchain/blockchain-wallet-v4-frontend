import * as AT from './actionTypes'
import { FiatActionTypes } from './types'
import { FiatType, SBTransactionsType } from 'core/types'

// FETCH_FIAT_TRANSACTIONS
export const fetchTransactions = (currency: FiatType, reset?: boolean) => ({
  type: AT.FETCH_FIAT_TRANSACTIONS,
  payload: { currency, reset }
})
export const fetchTransactionsFailure = (
  currency: FiatType,
  error
): FiatActionTypes => ({
  type: AT.FETCH_FIAT_TRANSACTIONS_FAILURE,
  payload: { currency, error }
})
export const fetchTransactionsLoading = (
  currency: FiatType,
  reset: boolean
): FiatActionTypes => ({
  type: AT.FETCH_FIAT_TRANSACTIONS_LOADING,
  payload: { currency, reset }
})
export const fetchTransactionsSuccess = (
  currency: FiatType,
  response: SBTransactionsType,
  reset?: boolean
): FiatActionTypes => ({
  type: AT.FETCH_FIAT_TRANSACTIONS_SUCCESS,
  payload: { currency, response, reset }
})
export const transactionsAtBound = (
  currency: FiatType,
  isAtBound: boolean
) => ({
  type: AT.FIAT_TRANSACTIONS_AT_BOUND,
  payload: {
    currency,
    isAtBound
  }
})
