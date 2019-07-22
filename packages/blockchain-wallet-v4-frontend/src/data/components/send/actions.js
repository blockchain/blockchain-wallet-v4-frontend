import * as AT from './actionTypes'

export const fetchPaymentsAccountPit = currency => ({
  type: AT.FETCH_PAYMENTS_ACCOUNT_PIT,
  payload: { currency }
})
export const fetchPaymentsAccountPitLoading = currency => ({
  type: AT.FETCH_PAYMENTS_ACCOUNT_PIT_LOADING,
  payload: { currency }
})
export const fetchPaymentsAccountPitFailure = (currency, e) => ({
  type: AT.FETCH_PAYMENTS_ACCOUNT_PIT_FAILURE,
  payload: { currency, e }
})
export const fetchPaymentsAccountPitSuccess = (currency, data) => ({
  type: AT.FETCH_PAYMENTS_ACCOUNT_PIT_SUCCESS,
  payload: { currency, data }
})
