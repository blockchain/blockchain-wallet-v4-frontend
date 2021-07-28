import { CoinType, FiatType, RemoteDataType, WalletFiatType } from 'core/types'

import * as AT from './actionTypes'

// types
export type RateType = {
  '15m': number
  buy: number
  last: number
  sell: number
  symbol: string
}

export type RatesType = number

export type PriceMovementDirType = 'none' | 'up' | 'down'
export type PriceDiffType = {
  diff: string
  movement: PriceMovementDirType
  percentChange: string
}

export type PriceChangeType = {
  currentPrice: number
  overallChange: PriceDiffType
  positionChange: PriceDiffType
  previousPrice: number
}

export enum TimeRange {
  ALL = 'all',
  DAY = 'day',
  MONTH = 'month',
  WEEK = 'week',
  YEAR = 'year'
}

// state
export type MiscStateType = {
  authorize_login: RemoteDataType<any, any>
  handle_2fa_reset: RemoteDataType<any, any>
  logs: RemoteDataType<any, any>
  pairing_code: RemoteDataType<any, any>
  price_change: {
    [key in TimeRange]: {
      [key in CoinType | WalletFiatType]: RemoteDataType<string, PriceChangeType>
    }
  }
  price_index_series: RemoteDataType<any, any>
  verify_email_token: RemoteDataType<any, any>
}

// actions

interface AuthorizeLoginFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.AUTHORIZE_LOGIN_FAILURE
}
interface AuthorizeLoginLoadingActionType {
  type: typeof AT.AUTHORIZE_LOGIN_LOADING
}
interface AuthorizeLoginSuccessActionType {
  payload: any
  type: typeof AT.AUTHORIZE_LOGIN_SUCCESS
}
interface EncodePairingCodeFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.ENCODE_PAIRING_CODE_FAILURE
}
interface EncodePairingCodeLoadingActionType {
  type: typeof AT.ENCODE_PAIRING_CODE_LOADING
}
interface EncodePairingCodeSuccessActionType {
  payload: any
  type: typeof AT.ENCODE_PAIRING_CODE_SUCCESS
}
interface FetchPriceChangeFailureActionType {
  payload: {
    base: CoinType
    error: string
    range: TimeRange
  }
  type: typeof AT.FETCH_PRICE_CHANGE_FAILURE
}
interface FetchPriceChangeLoadingActionType {
  payload: {
    base: CoinType
    range: TimeRange
  }
  type: typeof AT.FETCH_PRICE_CHANGE_LOADING
}
interface FetchPriceChangeSuccessActionType {
  payload: {
    base: CoinType
    range: TimeRange
  } & PriceChangeType
  type: typeof AT.FETCH_PRICE_CHANGE_SUCCESS
}
interface FetchPriceIndexSeriesFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_PRICE_INDEX_SERIES_FAILURE
}
interface FetchPriceIndexSeriesLoadingActionType {
  type: typeof AT.FETCH_PRICE_INDEX_SERIES_LOADING
}
interface FetchPriceIndexSeriesSuccessActionType {
  payload: any
  type: typeof AT.FETCH_PRICE_INDEX_SERIES_SUCCESS
}
interface Handle2FAResetFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.HANDLE_2FA_RESET_FAILURE
}
interface Handle2FAResetLoadingActionType {
  type: typeof AT.HANDLE_2FA_RESET_LOADING
}
interface Handle2FAResetSuccessActionType {
  payload: any
  type: typeof AT.HANDLE_2FA_RESET_SUCCESS
}
interface VerifyEmailTokenFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.VERIFY_EMAIL_TOKEN_FAILURE
}
interface VerifyEmailTokenLoadingActionType {
  type: typeof AT.VERIFY_EMAIL_TOKEN_LOADING
}
interface VerifyEmailTokenSuccessActionType {
  payload: any
  type: typeof AT.VERIFY_EMAIL_TOKEN_SUCCESS
}

export type MiscActionTypes =
  | AuthorizeLoginFailureActionType
  | AuthorizeLoginLoadingActionType
  | AuthorizeLoginSuccessActionType
  | EncodePairingCodeFailureActionType
  | EncodePairingCodeLoadingActionType
  | EncodePairingCodeSuccessActionType
  | FetchPriceChangeFailureActionType
  | FetchPriceChangeLoadingActionType
  | FetchPriceChangeSuccessActionType
  | FetchPriceIndexSeriesFailureActionType
  | FetchPriceIndexSeriesLoadingActionType
  | FetchPriceIndexSeriesSuccessActionType
  | Handle2FAResetFailureActionType
  | Handle2FAResetLoadingActionType
  | Handle2FAResetSuccessActionType
  | VerifyEmailTokenFailureActionType
  | VerifyEmailTokenLoadingActionType
  | VerifyEmailTokenSuccessActionType
