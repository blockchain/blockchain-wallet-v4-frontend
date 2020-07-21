import { FiatType, RemoteDataType, SBTransactionsType } from 'core/types'

import * as AT from './actionTypes'

// state
export type FiatStateType = {
  [key in FiatType]?: {
    next: RemoteDataType<string, SBTransactionsType['next']>
    prev: RemoteDataType<string, SBTransactionsType['prev']>
    transactions: Array<RemoteDataType<string, SBTransactionsType['items']>>
  }
}

// actions
interface FetchTransactionsFailureActionType {
  payload: { currency: FiatType; error: string }
  type: typeof AT.FETCH_FIAT_TRANSACTIONS_FAILURE
}
interface FetchTransactionsLoadingActionType {
  payload: { currency: FiatType; reset: boolean }
  type: typeof AT.FETCH_FIAT_TRANSACTIONS_LOADING
}
interface FetchTransactionsSuccessActionType {
  payload: {
    currency: FiatType
    reset?: boolean
    response: SBTransactionsType
  }
  type: typeof AT.FETCH_FIAT_TRANSACTIONS_SUCCESS
}

export type FiatActionTypes =
  | FetchTransactionsFailureActionType
  | FetchTransactionsLoadingActionType
  | FetchTransactionsSuccessActionType
