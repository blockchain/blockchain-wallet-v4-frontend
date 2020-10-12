import * as AT from './actionTypes'
import { CoinType, CurrenciesType, RemoteDataType } from 'core/types'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'

export type SwapFixType = 'baseInFiat' | 'base' | 'counter' | 'counterInFiat'

// Types
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

export type MempoolFeeType = 'regular' | 'priority'

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

export type SwapAccountType = {
  address: number | string
  archived: boolean
  balance: number
  coin: CoinType
  icon: keyof IcoMoonType
  index: number
  label: string
  noAccount: boolean
  type: 'ACCOUNT' | 'CUSTODIAL'
}

export type SwapAccountDropdownItemType = {
  text: string
  value?: SwapAccountType
}

export type SwapFormValuesType = {
  amount?: string
  fix?: SwapFixType
  from?: CoinType
  source?: SwapAccountType
  target?: SwapAccountType
  to?: CoinType
}

export type SwapLimitsType = {
  annual: LimitDurationType
  balanceMax: LimitAmountType
  daily: LimitDurationType
  maxFiatLimit: LimitAmountType
  maxOrder: LimitAmountType
  maxPossibleOrder: LimitAmountType
  minOrder: LimitAmountType
  weekly: LimitDurationType
}

// State
export interface ExchangeState {
  limits: RemoteDataType<
    string,
    { [key in keyof CurrenciesType]?: SwapLimitsType }
  >
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
    limits: { [key in keyof CurrenciesType]?: SwapLimitsType }
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
    error: string | null
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
