import * as AT from './actionTypes'

import {
  CoinType,
  CustodialTxResponseType,
  NabuCustodialProductType,
  RawBtcTxType,
  RemoteDataType,
  SBOrderType
} from 'core/types'

export const SUCCESS_STATUS = 'Success'

export const NabuProducts: Array<NabuCustodialProductType> = [
  'SAVINGS',
  'SIMPLEBUY',
  'SWAP'
]
export const NabuTxType: Array<'orders' | 'transactions'> = [
  'orders',
  'transactions'
]

// types
export type CustodialActivityType = {
  orders: {
    items: Array<SBOrderType>
    status: ActivityStatusType
  }
  transactions: {
    items: CustodialTxResponseType['items']
    next: string | null
    prev: string | null
    status: ActivityStatusType
  }
}

export type NonCustodialActivityType = {
  transactions: {
    items: Array<any>
    status: ActivityStatusType
  }
}

export type ActivityStatusType = RemoteDataType<string, typeof SUCCESS_STATUS>

// states
export type ActivityStateType = {
  [key in NabuCustodialProductType]: CustodialActivityType
} & {
  NON_CUSTODIAL: {
    [key in CoinType]: NonCustodialActivityType
  }
}

// actions
interface FetchCustodialActivityFailure {
  payload: {
    error: string
    product: NabuCustodialProductType
  }
  type: typeof AT.FETCH_CUSTODIAL_ACTIVITY_FAILURE
}
interface FetchCustodialActivityLoading {
  payload: {
    product: NabuCustodialProductType
  }
  type: typeof AT.FETCH_CUSTODIAL_ACTIVITY_LOADING
}
interface FetchCustodialActivitySuccess {
  payload: {
    orders: Array<SBOrderType>
    product: NabuCustodialProductType
    transactions: CustodialTxResponseType
  }
  type: typeof AT.FETCH_CUSTODIAL_ACTIVITY_SUCCESS
}
interface FetchNonCustodialActivityFailure {
  payload: {
    coin: CoinType
    error: string
  }
  type: typeof AT.FETCH_NON_CUSTODIAL_ACTIVITY_FAILURE
}
interface FetchNonCustodialActivityLoading {
  payload: {
    coin: CoinType
  }
  type: typeof AT.FETCH_NON_CUSTODIAL_ACTIVITY_LOADING
}
interface FetchNonCustodialActivitySuccess {
  payload: {
    coin: CoinType
    transactions: Array<RawBtcTxType>
  }
  type: typeof AT.FETCH_NON_CUSTODIAL_ACTIVITY_SUCCESS
}

export type ActivityActionType =
  | FetchCustodialActivityFailure
  | FetchCustodialActivityLoading
  | FetchCustodialActivitySuccess
  | FetchNonCustodialActivityFailure
  | FetchNonCustodialActivityLoading
  | FetchNonCustodialActivitySuccess
