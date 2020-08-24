import * as AT from './actionTypes'

export const fetchPaymentsAccountExchange = currency => ({
  type: AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE,
  payload: { currency }
})
export const fetchPaymentsAccountExchangeLoading = currency => ({
  type: AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_LOADING,
  payload: { currency }
})
export const fetchPaymentsAccountExchangeFailure = (currency, e) => ({
  type: AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_FAILURE,
  payload: { currency, e }
})
export const fetchPaymentsAccountExchangeSuccess = (currency, data) => ({
  type: AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_SUCCESS,
  payload: { currency, data }
})
