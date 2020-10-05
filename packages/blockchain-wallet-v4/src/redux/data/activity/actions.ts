import * as AT from './actionTypes'
import {
  ActivityActionType,
  CoinType,
  CustodialTxResponseType,
  NabuCustodialProductType,
  ProcessedTxType,
  SBOrderType
} from 'core/types'

export const fetchActivity = () => ({
  type: AT.FETCH_ACTIVITY
})

export const fetchCustodialActivityFailure = (
  product: NabuCustodialProductType,
  error: string
): ActivityActionType => ({
  type: AT.FETCH_CUSTODIAL_ACTIVITY_FAILURE,
  payload: {
    product,
    error
  }
})
export const fetchCustodialActivityLoading = (
  product: NabuCustodialProductType
): ActivityActionType => ({
  type: AT.FETCH_CUSTODIAL_ACTIVITY_LOADING,
  payload: {
    product
  }
})
export const fetchCustodialActivitySuccess = (
  product: NabuCustodialProductType,
  transactions: CustodialTxResponseType,
  orders: Array<SBOrderType>
): ActivityActionType => ({
  type: AT.FETCH_CUSTODIAL_ACTIVITY_SUCCESS,
  payload: {
    product,
    orders,
    transactions
  }
})

export const fetchNonCustodialActivityFailure = (
  coin: CoinType,
  error: string
): ActivityActionType => ({
  type: AT.FETCH_NON_CUSTODIAL_ACTIVITY_FAILURE,
  payload: {
    coin,
    error
  }
})
export const fetchNonCustodialActivityLoading = (
  coin: CoinType
): ActivityActionType => ({
  type: AT.FETCH_NON_CUSTODIAL_ACTIVITY_LOADING,
  payload: {
    coin
  }
})
export const fetchNonCustodialActivitySuccess = (
  coin: CoinType,
  transactions: Array<ProcessedTxType>
): ActivityActionType => ({
  type: AT.FETCH_NON_CUSTODIAL_ACTIVITY_SUCCESS,
  payload: {
    coin,
    transactions
  }
})
