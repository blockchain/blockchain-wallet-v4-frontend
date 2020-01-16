import * as AT from './actionTypes'
import * as Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'
import { String } from 'index'

// Types
// @PHIL limts are repetitive, should this be explicit for every one?

export type LimitsType = {
  annual: AnnualType
  balanceMax: BalanceMaxType
  daily: DailyType
  maxFiatLimit: MaxFiatLimitType
  maxOrder: MaxOrderType
  minOrder: MinOrderType
  weekly: WeeklyType
}

export type MinOrderType = {
  amount: string
  fiat: boolean
  symbol: string
}

export type MaxOrderType = {
  amount: string
  fiat: boolean
  symbol: string
}

export type MaxPossibleOrderType = {
  amount: string
  fiat: boolean
  symbol: string
}

export type AmountType = {
  available: string
  limit: string
  used: string
}

export type DailyType = {
  amount: AmountType
  fiat: boolean
  symbol: string
}

export type WeeklyType = {
  amount: AmountType
  fiat: boolean
  symbol: string
}

export type AnnualType = {
  amount: AmountType
  fiat: boolean
  symbol: string
}

export type MaxFiatLimitType = {
  amount: string
  fiat: boolean
  symbol: string
}

export type BalanceMaxType = {
  amount: string
  fiat: boolean
  symbol: string
}

export type SourceFeeType = {
  isSourceErc20: boolean
  mempoolFees: {
    limits: {
      max: number
      min: number
    }
    priority: number
    regular: number
  }
  source: string
  sourceFiat: string
  target: string
}

// State
export interface ExchangeState {
  limits: RemoteData<string, Currencies<LimitsType>>
  max: null | AmountType
  min: null | AmountType
  showError: boolean
  // @PHIL not sure about this one
  // targetFee: RemoteData<string, array>
  sourceFee: SourceFeeType
  txError: string | null
}

// Actions
// Keep these sorted alphabetically

interface FetchLimitsError {
  payload: {
    e: string
  }
  type: typeof AT.EXCHANGE.FETCH_LIMITS_ERROR
}

interface FetchLimitsLoading {
  type: AT.EXCHANGE.FETCH_LIMITS_LOADING
}

interface FetchLimitsSuccess {
  paylod: {
    limits: Currencies<LimitsType>
  }
  type: typeof AT.EXCHANGE.FETCH_LIMITS_SUCCESS
}

interface FetchTargetFeesError {
  payload: {
    e: string
  }
  type: typeof AT.FETCH_TARGET_FEES_ERROR
}

interface FetchTargetFeesLoading {
  type: typeof AT.FETCH_TARGET_FEES_LOADING
}
// @PHIL see above in state as well, target fee is an empty array in the wallet
interface FetchTargetFeesSuccess {
  payload: {
    fee: string
  }
  type: typeof AT.FETCH_TARGET_FEES_SUCCESS
}

interface SetMinMax {
  paylaod: {
    max: AmountType
    min: AmountType
  }
  type: typeof AT.SET_MIN_MAX
}
interface SetShowError {
  payload: {
    showError: boolean
  }
  type: typeof AT.EXCHANGE.SET_SHOW_ERROR
}

interface SetSourceFee {
  payload: {
    fee: SourceFeeType
  }
  type: typeof AT.SET_SOURCE_FEE
}

interface SetStep {
  // @PHIL not sure what the data type for step is
  // payload: {
  //     step:
  // }
  type: typeof AT.SET_STEP
}

interface SetTxError {
  payload: {
    e: string
  }
  type: typeof AT.SET_TX_ERROR
}

interface ShowConfirmation {
  type: typeof AT.SHOW_CONFIRMATION
}

export type ExchangeActionType =
  | FetchLimitsError
  | FetchLimitsLoading
  | FetchLimitsSuccess
  | FetchTargetFeesError
  | FetchTargetFeesLoading
  | FetchTargetFeesSuccess
  | SetMinMax
  | SetShowError
  | SetSourceFee
  | SetStep
  | SetTxError
  | ShowConfirmation
