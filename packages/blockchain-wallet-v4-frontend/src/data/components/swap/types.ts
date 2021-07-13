import {
  CoinType,
  Erc20CoinType,
  PaymentValue,
  RemoteDataType,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

export type MempoolFeeType = 'regular' | 'priority'

export enum SwapBaseCounterTypes {
  ACCOUNT = 'ACCOUNT',
  CUSTODIAL = 'CUSTODIAL'
}
export type SwapAccountType = {
  accountIndex?: number
  address: number | string
  archived: boolean
  balance: number | string
  baseCoin: Exclude<CoinType, Erc20CoinType>
  coin: CoinType
  index: number
  label: string
  type: SwapBaseCounterTypes
}

export type SwapAmountFormValues = { amount?: string; cryptoAmount?: string } | undefined

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
  'NO_HOLDINGS',
  'ENTER_AMOUNT',
  'UPGRADE_PROMPT',
  'PREVIEW_SWAP',
  'SUCCESSFUL_SWAP',
  'ORDER_DETAILS'
}

export type SwapSideType = 'BASE' | 'COUNTER'
export type SwapCheckoutFixType = 'CRYPTO' | 'FIAT'

// state
export type SwapState = {
  custodialEligibility: RemoteDataType<string, boolean>
  fix: SwapCheckoutFixType
  limits: RemoteDataType<string, SwapUserLimitsType>
  order?: SwapOrderType
  pairs: RemoteDataType<string, Array<string>>
  payment: RemoteDataType<string, undefined | PaymentValue>
  quote: RemoteDataType<string, { quote: SwapQuoteType; rate: number }>
  side: SwapSideType
  step: keyof typeof SwapStepType
  trades: {
    list: Array<SwapOrderType>
    status: RemoteDataType<string, string>
  }
}

// actions
interface FetchCustodialEligibilityFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_CUSTODIAL_ELIGIBILITY_FAILURE
}
interface FetchCustodialLoadingActionType {
  type: typeof AT.FETCH_CUSTODIAL_ELIGIBILITY_LOADING
}
interface FetchEligibilitySuccessActionType {
  payload: {
    eligibility: boolean
  }
  type: typeof AT.FETCH_CUSTODIAL_ELIGIBILITY_SUCCESS
}

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

interface FetchPairsFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_PAIRS_FAILURE
}
interface FetchPairsLoadingActionType {
  type: typeof AT.FETCH_PAIRS_LOADING
}
interface FetchPairsSuccessActionType {
  payload: {
    pairs: Array<string>
  }
  type: typeof AT.FETCH_PAIRS_SUCCESS
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

interface FetchTradesFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_TRADES_FAILURE
}
interface FetchTradesLoadingActionType {
  type: typeof AT.FETCH_TRADES_LOADING
}
interface FetchTradesSuccessActionType {
  payload: {
    trades: Array<SwapOrderType>
  }
  type: typeof AT.FETCH_TRADES_SUCCESS
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

interface SetSwapCheckoutFixType {
  payload: {
    fix: SwapCheckoutFixType
  }
  type: typeof AT.SET_CHECKOUT_FIX
}
interface SetSwapStepActionType {
  payload: SwapStepPayload
  type: typeof AT.SET_STEP
}

interface SwitchFixActionType {
  payload: {
    amount: string
    fix: SwapCheckoutFixType
  }
  type: typeof AT.SWITCH_FIX
}

export type SwapStepPayload =
  // added these optional payloads for data science tracking
  | {
      options?: {
        account?: SwapBaseCounterTypes
        coin?: CoinType
        side?: 'BASE' | 'COUNTER'
      }
      step: 'ENTER_AMOUNT'
    }
  | {
      options?: {
        account?: SwapBaseCounterTypes
        coin?: CoinType
        side?: 'BASE' | 'COUNTER'
      }
      step: 'INIT_SWAP'
    }
  | {
      options?: {
        baseAccountType?: SwapBaseCounterTypes
        baseCoin?: CoinType
        counterAccountType?: SwapBaseCounterTypes
        counterCoin?: CoinType
      }
      step: 'PREVIEW_SWAP'
    }
  | {
      options: {
        order: SwapOrderType
      }
      step: 'ORDER_DETAILS'
    }
  | {
      options: {
        order: SwapOrderType
      }
      step: 'SUCCESSFUL_SWAP'
    }
  | { options: { side: 'BASE' | 'COUNTER' }; step: 'COIN_SELECTION' }
  | { options?: never; step: 'UPGRADE_PROMPT' }
  | {
      options?: never
      step: 'NO_HOLDINGS'
    }

export type SwapActionTypes =
  | FetchCustodialEligibilityFailureActionType
  | FetchCustodialLoadingActionType
  | FetchEligibilitySuccessActionType
  | FetchLimitsFailureActionType
  | FetchLimitsLoadingActionType
  | FetchLimitsSuccessActionType
  | FetchQuoteFailureActionType
  | FetchQuoteLoadingActionType
  | FetchQuoteSuccessActionType
  | FetchPairsFailureActionType
  | FetchPairsLoadingActionType
  | FetchPairsSuccessActionType
  | FetchTradesFailureActionType
  | FetchTradesLoadingActionType
  | FetchTradesSuccessActionType
  | UpdatePaymentFailureActionType
  | UpdatePaymentLoadingActionType
  | UpdatePaymentSuccessActionType
  | SetSwapCheckoutFixType
  | SetSwapStepActionType
  | SwitchFixActionType
