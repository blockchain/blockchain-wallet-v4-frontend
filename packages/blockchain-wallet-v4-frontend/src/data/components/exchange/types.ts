import * as AT from './actionTypes'
import * as Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'
import { String } from 'index'

// Types

export type LimitsType = {
  annual: LimitDurationType
  balanceMax: LimitAmountType
  daily: LimitDurationType
  maxFiatLimit: LimitAmountType
  maxOrder: LimitAmountType
  maxPossibleOrder: LimitAmountType
  minOrder: LimitAmountType
  weekly: LimitDurationType
}

export type LimitAmountType = {
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

export type SourceFeeType =
  | {
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
  | {
      source: number
      target: number
    }

// State
export interface ExchangeState {
  limits: RemoteData<string, Currencies<LimitsType>>
  max: null | LimitAmountType
  min: null | LimitAmountType
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
    max: LimitAmountType | null
    min: LimitAmountType | null
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
  | SetTxError
  | ShowConfirmation
