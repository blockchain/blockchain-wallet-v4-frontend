import { UnstoppableDomainResultsType } from '@core/network/api/send/types'
import {
  BeneficiaryType,
  CoinType,
  RemoteDataType,
  WithdrawalLockCheckResponseType
} from '@core/types'

import * as AT from './actionTypes'

export const emojiRegex =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/

export type SendState = {
  exchangePaymentsAccount: {
    [key in string]: RemoteDataType<any, any>
  }
  tradingPaymentsAccount: {
    [key in string]: RemoteDataType<any, BeneficiaryType>
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
