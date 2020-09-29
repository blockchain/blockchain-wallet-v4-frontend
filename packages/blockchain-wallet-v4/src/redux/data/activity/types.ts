import * as AT from './actionTypes'

import {
  CoinType,
  CustodialTxResponseType,
  NabuCustodialProductType
} from 'core/types'

// states
export type ActivityStateType = {
  [key in NabuCustodialProductType]: {
    orders: Array<any>
    transactions: {
      items: Array<any>
      next: string | null
      prev: string | null
    }
  }
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
    orders: any,
    product: NabuCustodialProductType,
    transactions: CustodialTxResponseType
  }
  type: typeof AT.FETCH_CUSTODIAL_ACTIVITY_SUCCESS
}

export type ActivityActionType =
  | FetchCustodialActivityFailure
  | FetchCustodialActivityLoading
  | FetchCustodialActivitySuccess
