import * as AT from './actionTypes'
import {
  ActivityActionType,
  CustodialTxResponseType,
  NabuCustodialProductType
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
  orders
): ActivityActionType => ({
  type: AT.FETCH_CUSTODIAL_ACTIVITY_SUCCESS,
  payload: {
    product,
    orders,
    transactions
  }
})
