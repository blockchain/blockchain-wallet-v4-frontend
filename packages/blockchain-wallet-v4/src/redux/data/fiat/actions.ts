import { WalletFiatType } from 'core/types'

import * as AT from './actionTypes'
import { FiatActionTypes, FiatTransactionPageResponseType } from './types'

// FETCH_FIAT_TRANSACTIONS
export const fetchTransactions = (currency: WalletFiatType, reset?: boolean) => ({
  payload: { currency, reset },
  type: AT.FETCH_FIAT_TRANSACTIONS
})
export const fetchTransactionsFailure = (currency: WalletFiatType, error): FiatActionTypes => ({
  payload: { currency, error },
  type: AT.FETCH_FIAT_TRANSACTIONS_FAILURE
})
export const fetchTransactionsLoading = (
  currency: WalletFiatType,
  reset: boolean
): FiatActionTypes => ({
  payload: { currency, reset },
  type: AT.FETCH_FIAT_TRANSACTIONS_LOADING
})
export const fetchTransactionsSuccess = (
  currency: WalletFiatType,
  response: FiatTransactionPageResponseType,
  reset?: boolean
): FiatActionTypes => ({
  payload: { currency, reset, response },
  type: AT.FETCH_FIAT_TRANSACTIONS_SUCCESS
})
export const transactionsAtBound = (currency: WalletFiatType, isAtBound: boolean) => ({
  payload: {
    currency,
    isAtBound
  },
  type: AT.FIAT_TRANSACTIONS_AT_BOUND
})
