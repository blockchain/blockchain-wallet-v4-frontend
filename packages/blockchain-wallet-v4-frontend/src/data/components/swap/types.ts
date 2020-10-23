import * as AT from './actionTypes'
import {
  CoinType,
  Erc20CoinType,
  PaymentValue,
  RemoteDataType,
  SwapQuoteType,
  SwapUserLimitsType
} from 'core/types'

export type SwapAccountType = {
  address: number | string
  archived: boolean
  balance: number
  baseCoin: Exclude<CoinType, Erc20CoinType>
  coin: CoinType
  index: number
  label: string
  type: 'ACCOUNT' | 'CUSTODIAL'
}

export type SwapAmountFormValues = { amount?: string } | undefined

export type InitSwapFormValuesType =
  | {
      BASE?: SwapAccountType
      COUNTER?: SwapAccountType
    }
  | undefined

export type SwapCoinType = CoinType

export enum SwapStepType {
  'INIT_SWAP',
  'COIN_SELECTION',
  'ENTER_AMOUNT',
  'PREVIEW_SWAP'
}

export type SwapSideType = 'BASE' | 'COUNTER'

// state
export type SwapState = {
  limits: RemoteDataType<string, SwapUserLimitsType>
  payment: RemoteDataType<string, undefined | PaymentValue>
  quote: RemoteDataType<string, { quote: SwapQuoteType; rate: number }>
  side: SwapSideType
  step: keyof typeof SwapStepType
}

// actions
interface FetchLimitsFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_LIMITS_FAILURE
}
interface FetchLimitsLoadingActionType {
  type: typeof AT.FETCH_LIMITS_LOADING
}
interface FetchLimitsSuccessActionType {
  payload: {
    limits: SwapUserLimitsType
  }
  type: typeof AT.FETCH_LIMITS_SUCCESS
}

interface FetchQuoteFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_QUOTE_FAILURE
}
interface FetchQuoteLoadingActionType {
  type: typeof AT.FETCH_QUOTE_LOADING
}
interface FetchQuoteSuccessActionType {
  payload: {
    quote: SwapQuoteType
    rate: number
  }
  type: typeof AT.FETCH_QUOTE_SUCCESS
}

interface UpdatePaymentFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.UPDATE_PAYMENT_FAILURE
}
interface UpdatePaymentLoadingActionType {
  type: typeof AT.UPDATE_PAYMENT_LOADING
}
interface UpdatePaymentSuccessActionType {
  payload: {
    payment: undefined | PaymentValue
  }
  type: typeof AT.UPDATE_PAYMENT_SUCCESS
}

interface SetSwapStepActionType {
  payload: SwapStepPayload
  type: typeof AT.SET_STEP
}

export type SwapStepPayload =
  | {
      options?: never
      step: 'ENTER_AMOUNT'
    }
  | {
      options?: never
      step: 'INIT_SWAP'
    }
  | { options?: never; step: 'PREVIEW_SWAP' }
  | { options: { side: 'BASE' | 'COUNTER' }; step: 'COIN_SELECTION' }

export type SwapActionTypes =
  | FetchLimitsFailureActionType
  | FetchLimitsLoadingActionType
  | FetchLimitsSuccessActionType
  | FetchQuoteFailureActionType
  | FetchQuoteLoadingActionType
  | FetchQuoteSuccessActionType
  | UpdatePaymentFailureActionType
  | UpdatePaymentLoadingActionType
  | UpdatePaymentSuccessActionType
  | SetSwapStepActionType
