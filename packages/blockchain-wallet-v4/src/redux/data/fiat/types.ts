import { RemoteDataType, WalletFiatType } from 'core/types'

import { FiatSBAndSwapTransactionType } from '../custodial/types'
import * as AT from './actionTypes'

// state
export type FiatStateType = {
  [key in WalletFiatType]?: {
    nextSbTxId: RemoteDataType<
      string | undefined,
      FiatTransactionPageResponseType['nextSbTxId']
    >
    nextSbTxTimestamp: RemoteDataType<
      string | undefined,
      FiatTransactionPageResponseType['nextSbTxTimestamp']
    >
    nextSwapPageTimestamp: RemoteDataType<
      string | undefined,
      FiatTransactionPageResponseType['nextSwapPageTimestamp']
    >
    page: Array<RemoteDataType<string, FiatTransactionPageResponseType['page']>>
  }
}

// actions
interface FetchTransactionsFailureActionType {
  payload: { currency: WalletFiatType; error: string }
  type: typeof AT.FETCH_FIAT_TRANSACTIONS_FAILURE
}
interface FetchTransactionsLoadingActionType {
  payload: { currency: WalletFiatType; reset: boolean }
  type: typeof AT.FETCH_FIAT_TRANSACTIONS_LOADING
}
interface FetchTransactionsSuccessActionType {
  payload: {
    currency: WalletFiatType
    reset?: boolean
    response: FiatTransactionPageResponseType
  }
  type: typeof AT.FETCH_FIAT_TRANSACTIONS_SUCCESS
}

// TODO: remove type once we have consolidated custodial transaction endpoints
export type FiatTransactionPageResponseType = {
  nextSbTxId?: string
  nextSbTxTimestamp?: string
  nextSwapPageTimestamp?: string
  page: Array<FiatSBAndSwapTransactionType>
}

export type FiatActionTypes =
  | FetchTransactionsFailureActionType
  | FetchTransactionsLoadingActionType
  | FetchTransactionsSuccessActionType
