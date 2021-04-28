import {
  BeneficiaryType,
  CoinType,
  PaymentValue,
  WithdrawalLockCheckResponseType
} from 'blockchain-wallet-v4/src/types'
import { UnstoppableDomainResultsType } from 'core/network/api/send/types'

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

export const fetchUnstoppableDomainResults = (
  name: string,
  currency?: string
) => ({
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS,
  payload: { name, currency }
})
export const fetchUnstoppableDomainResultsLoading = () => ({
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_LOADING
})
export const fetchUnstoppableDomainResultsNotAsked = () => ({
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_NOT_ASKED
})
export const fetchUnstoppableDomainResultsFailure = (e: string) => ({
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_FAILURE,
  payload: { e }
})
export const fetchUnstoppableDomainResultsSuccess = (
  data: UnstoppableDomainResultsType
) => ({
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_SUCCESS,
  payload: { data }
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

export const getLockRule = () => ({
  type: AT.GET_LOCK_RULE
})
export const getLockRuleLoading = () => ({
  type: AT.GET_LOCK_RULE_LOADING
})
export const getLockRuleFailure = e => ({
  type: AT.GET_LOCK_RULE_FAILURE,
  payload: { e }
})
export const getLockRuleSuccess = (
  withdrawalLockCheckResponse: WithdrawalLockCheckResponseType
) => ({
  type: AT.GET_LOCK_RULE_SUCCESS,
  payload: { withdrawalLockCheckResponse }
})
