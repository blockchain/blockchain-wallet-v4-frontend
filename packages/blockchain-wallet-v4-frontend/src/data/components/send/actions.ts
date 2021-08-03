import {
  BeneficiaryType,
  CoinType,
  PaymentValue,
  WithdrawalLockCheckResponseType
} from 'blockchain-wallet-v4/src/types'
import { UnstoppableDomainResultsType } from 'core/network/api/send/types'

import * as AT from './actionTypes'

export const fetchPaymentsAccountExchange = (currency) => ({
  payload: { currency },
  type: AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE
})
export const fetchPaymentsAccountExchangeLoading = (currency) => ({
  payload: { currency },
  type: AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_LOADING
})
export const fetchPaymentsAccountExchangeFailure = (currency, e) => ({
  payload: { currency, e },
  type: AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_FAILURE
})
export const fetchPaymentsAccountExchangeSuccess = (currency, data) => ({
  payload: { currency, data },
  type: AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_SUCCESS
})

export const fetchPaymentsTradingAccount = (currency: CoinType) => ({
  payload: { currency },
  type: AT.FETCH_PAYMENTS_TRADING_ACCOUNTS
})
export const fetchPaymentsTradingAccountLoading = (currency: CoinType) => ({
  payload: { currency },
  type: AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_LOADING
})
export const fetchPaymentsTradingAccountFailure = (currency: CoinType, e) => ({
  payload: { currency, e },
  type: AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_FAILURE
})
export const fetchPaymentsTradingAccountSuccess = (
  currency: CoinType,
  tradingAccount: BeneficiaryType
) => ({
  payload: { currency, tradingAccount },
  type: AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_SUCCESS
})

export const fetchUnstoppableDomainResults = (name: string, currency?: string) => ({
  payload: { currency, name },
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS
})
export const fetchUnstoppableDomainResultsLoading = () => ({
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_LOADING
})
export const fetchUnstoppableDomainResultsNotAsked = () => ({
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_NOT_ASKED
})
export const fetchUnstoppableDomainResultsFailure = (e: string) => ({
  payload: { e },
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_FAILURE
})
export const fetchUnstoppableDomainResultsSuccess = (data: UnstoppableDomainResultsType) => ({
  payload: { data },
  type: AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_SUCCESS
})

export const notifyNonCustodialToCustodialTransfer = (
  payment: PaymentValue,
  product: 'SAVINGS' | 'SIMPLEBUY'
) => ({
  payload: {
    payment,
    product
  },
  type: AT.NOTIFY_NON_CUSTODIAL_TO_CUSTODIAL_TRANSFER
})

export const getLockRule = () => ({
  type: AT.GET_LOCK_RULE
})
export const getLockRuleLoading = () => ({
  type: AT.GET_LOCK_RULE_LOADING
})
export const getLockRuleFailure = (e) => ({
  payload: { e },
  type: AT.GET_LOCK_RULE_FAILURE
})
export const getLockRuleSuccess = (
  withdrawalLockCheckResponse: WithdrawalLockCheckResponseType
) => ({
  payload: { withdrawalLockCheckResponse },
  type: AT.GET_LOCK_RULE_SUCCESS
})
