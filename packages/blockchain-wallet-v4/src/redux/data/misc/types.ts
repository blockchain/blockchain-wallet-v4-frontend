import * as AT from './actionTypes'
import { CoinType, FiatType, RemoteDataType, WalletFiatType } from 'core/types'

// types
export type RateType = {
  '15m': number
  buy: number
  last: number
  sell: number
  symbol: string
}

export type RatesType = {
  [key in FiatType]: RateType
}

export type PriceMovementDirType = 'none' | 'up' | 'down'

export type PriceChangeType = {
  change: string
  movement: PriceMovementDirType
  price: number
}

// state
export type MiscStateType = {
  authorize_login: RemoteDataType<any, any>
  captcha: RemoteDataType<any, any>
  handle_2fa_reset: RemoteDataType<any, any>
  logs: RemoteDataType<any, any>
  pairing_code: RemoteDataType<any, any>
  price_24h: {
    [key in CoinType | WalletFiatType]: RemoteDataType<string, PriceChangeType>
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
interface FetchCaptchaFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_CAPTCHA_FAILURE
}
interface FetchCaptchaLoadingActionType {
  type: typeof AT.FETCH_CAPTCHA_LOADING
}
interface FetchCaptchaSuccessActionType {
  payload: any
  type: typeof AT.FETCH_CAPTCHA_SUCCESS
}
interface FetchPrice24HFailureActionType {
  payload: {
    base: CoinType
    error: string
  }
  type: typeof AT.FETCH_PRICE_24H_FAILURE
}
interface FetchPrice24HLoadingActionType {
  payload: {
    base: CoinType
  }
  type: typeof AT.FETCH_PRICE_24H_LOADING
}
interface FetchPrice24HSuccessActionType {
  payload: {
    base: CoinType
    change: string
    movement: PriceMovementDirType
    price: number
  }
  type: typeof AT.FETCH_PRICE_24H_SUCCESS
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
  | FetchCaptchaFailureActionType
  | FetchCaptchaLoadingActionType
  | FetchCaptchaSuccessActionType
  | FetchPrice24HFailureActionType
  | FetchPrice24HLoadingActionType
  | FetchPrice24HSuccessActionType
  | FetchPriceIndexSeriesFailureActionType
  | FetchPriceIndexSeriesLoadingActionType
  | FetchPriceIndexSeriesSuccessActionType
  | Handle2FAResetFailureActionType
  | Handle2FAResetLoadingActionType
  | Handle2FAResetSuccessActionType
  | VerifyEmailTokenFailureActionType
  | VerifyEmailTokenLoadingActionType
  | VerifyEmailTokenSuccessActionType
