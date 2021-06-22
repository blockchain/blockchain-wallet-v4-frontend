import {
  BeneficiaryType,
  CoinType,
  RemoteDataType,
  WithdrawalLockCheckResponseType
} from 'blockchain-wallet-v4/src/types'
import { UnstoppableDomainResultsType } from 'core/network/api/send/types'

import * as AT from './actionTypes'

export type SendState = {
  exchangePaymentsAccount: {
    [key in CoinType]: RemoteDataType<any, any>
  }
  tradingPaymentsAccount: {
    [key in CoinType]: RemoteDataType<any, BeneficiaryType>
  }
  unstoppableDomainResults: RemoteDataType<string, UnstoppableDomainResultsType>
  withdrawLockCheck: RemoteDataType<string, WithdrawalLockCheckResponseType>
}

interface FetchPaymentsAccountExchangeFailureAction {
  payload: { currency: CoinType; e: string }
  type: typeof AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_FAILURE
}

interface FetchPaymentsAccountExchangeLoadingAction {
  payload: { currency: CoinType }
  type: typeof AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_LOADING
}

interface FetchPaymentsAccountExchangeSuccessAction {
  payload: { currency: CoinType; data: any }
  type: typeof AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_SUCCESS
}

interface FetchPaymentsAccountTradingFailureAction {
  payload: { currency: CoinType; e: string }
  type: typeof AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_FAILURE
}

interface FetchPaymentsAccountTradingLoadingAction {
  payload: { currency: CoinType }
  type: typeof AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_LOADING
}

interface FetchPaymentsAccountTradingSuccessAction {
  payload: { currency: CoinType; tradingAccount: BeneficiaryType }
  type: typeof AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_SUCCESS
}

interface FetchUnstoppableDomainResultsFailureAction {
  payload: {
    e: string
  }
  type: typeof AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_FAILURE
}
interface FetchUnstoppableDomainResultsNotAskedAction {
  type: typeof AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_NOT_ASKED
}

interface FetchUnstoppableDomainResultsLoadingAction {
  type: typeof AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_LOADING
}

interface FetchUnstoppableDomainResultsSuccessAction {
  payload: {
    data: UnstoppableDomainResultsType
  }
  type: typeof AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_SUCCESS
}

interface GetLockRuleFailureAction {
  payload: {
    e: string
  }
  type: typeof AT.GET_LOCK_RULE_FAILURE
}

interface GetLockRuleLoadingAction {
  type: typeof AT.GET_LOCK_RULE_LOADING
}

interface GetLockRuleSuccessAction {
  payload: {
    withdrawalLockCheckResponse: WithdrawalLockCheckResponseType
  }
  type: typeof AT.GET_LOCK_RULE_SUCCESS
}

export type SendActionTypes =
  | FetchPaymentsAccountExchangeFailureAction
  | FetchPaymentsAccountExchangeLoadingAction
  | FetchPaymentsAccountExchangeSuccessAction
  | FetchPaymentsAccountTradingFailureAction
  | FetchPaymentsAccountTradingLoadingAction
  | FetchPaymentsAccountTradingSuccessAction
  | FetchUnstoppableDomainResultsFailureAction
  | FetchUnstoppableDomainResultsLoadingAction
  | FetchUnstoppableDomainResultsSuccessAction
  | FetchUnstoppableDomainResultsNotAskedAction
  | GetLockRuleFailureAction
  | GetLockRuleLoadingAction
  | GetLockRuleSuccessAction
