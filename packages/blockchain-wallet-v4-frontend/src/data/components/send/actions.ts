import * as AT from './actionTypes'
import { BeneficiaryType, CoinType, PaymentValue } from 'core/types'

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

export const fetchPaymentsTradingAccount = (currency: CoinType) => ({
  type: AT.FETCH_PAYMENTS_TRADING_ACCOUNTS,
  payload: { currency }
})
export const fetchPaymentsTradingAccountLoading = (currency: CoinType) => ({
  type: AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_LOADING,
  payload: { currency }
})
export const fetchPaymentsTradingAccountFailure = (currency: CoinType, e) => ({
  type: AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_FAILURE,
  payload: { currency, e }
})
export const fetchPaymentsTradingAccountSuccess = (
  currency: CoinType,
  tradingAccount: BeneficiaryType
) => ({
  type: AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_SUCCESS,
  payload: { currency, tradingAccount }
})

export const notifyNonCustodialToCustodialTransfer = (
  payment: PaymentValue,
  product: 'SAVINGS' | 'SIMPLEBUY'
) => ({
  type: AT.NOTIFY_NON_CUSTODIAL_TO_CUSTODIAL_TRANSFER,
  payload: {
    payment,
    product
  }
})
