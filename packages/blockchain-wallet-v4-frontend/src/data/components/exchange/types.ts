import * as AT from './actionTypes'
import * as Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'
import { String } from 'index'

// Types
// @PHIL limts are repetitive, should this be explicit for every one?

export type LimitsType = {
  annual: LimitDurationType
  balanceMax: BalanceMaxType
  daily: LimitDurationType
  maxFiatLimit: MaxFiatLimitType
  maxOrder: OrderType
  maxPossibleOrder: OrderType
  minOrder: OrderType
  weekly: LimitDurationType
}

export type OrderType = {
  amount: string
  fiat: boolean
  symbol: string
}

export type AmountType = {
  available: string
  limit: string
  used: string
}

export type LimitDurationType = {
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
  source: number | string
  sourceFiat: string
  target: number | string
}

// State
export interface ExchangeState {
  limits: RemoteData<string, Currencies<LimitsType>>
  max: null | AmountType
  min: null | AmountType
  showError: boolean
  sourceFee: SourceFeeType
  txError: string | null
}

// Actions
// Keep these sorted alphabetically

interface FetchLimitsError {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_LIMITS_ERROR
}

interface FetchLimitsLoading {
  type: typeof AT.FETCH_LIMITS_LOADING
}

interface FetchLimitsSuccess {
  payload: {
    limits: Currencies<LimitsType>
  }
  type: typeof AT.FETCH_LIMITS_SUCCESS
}

interface SetMinMax {
  payload: {
    max: AmountType
    min: AmountType
  }
  type: typeof AT.SET_MIN_MAX
}
interface SetShowError {
  payload: {
    showError: boolean
  }
  type: typeof AT.SET_SHOW_ERROR
}

interface SetSourceFee {
  payload: {
    fee: SourceFeeType
  }
  type: typeof AT.SET_SOURCE_FEE
}

// interface SetStep {
//   // @PHIL not sure what the data type for step is, I don't think it's being used
//   payload: {
//       step: any
//   }
//   type: typeof AT.SET_STEP
// }

interface SetTxError {
  payload: {
    error: string
  }
  type: typeof AT.SET_TX_ERROR
}

interface ShowConfirmation {
  type: typeof AT.SHOW_CONFIRMATION
}

export type ExchangeActionTypes =
  | FetchLimitsError
  | FetchLimitsLoading
  | FetchLimitsSuccess
  | SetMinMax
  | SetShowError
  | SetSourceFee
  //  SetStep |
  | SetTxError
  | ShowConfirmation
