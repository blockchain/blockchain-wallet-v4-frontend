import * as AT from './actionTypes'

import {
  CoinType,
  CustodialTxResponseType,
  NabuCustodialProductType,
  RemoteDataType,
  SBOrderType
} from 'core/types'

// types
export type CustodialActivityType = {
  orders: Array<RemoteDataType<string, Array<SBOrderType>>>
  transactions: {
    items: Array<
      RemoteDataType<string, Array<CustodialTxResponseType['items']>>
    >
    next: string | null
    prev: string | null
  }
}

// states
export type ActivityStateType = {
  [key in NabuCustodialProductType]: CustodialActivityType
} & {
  NON_CUSTODIAL: {
    [key in CoinType]: {
      transactions: Array<any>
    }
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

export type ActivityActionType =
  | FetchCustodialActivityFailure
  | FetchCustodialActivityLoading
  | FetchCustodialActivitySuccess
