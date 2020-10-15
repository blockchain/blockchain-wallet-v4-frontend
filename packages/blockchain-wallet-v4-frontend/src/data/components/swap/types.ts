import * as AT from './actionTypes'
import { CoinType, RemoteDataType, SwapQuoteType } from 'core/types'
import { SwapAccountType } from '../exchange/types'

export type InitSwapFormValuesType =
  | {
      BASE?: SwapAccountType
      COUNTER?: SwapAccountType
    }
  | undefined

export type SwapCoinType = Exclude<CoinType, 'ALGO'>

export enum SwapStepType {
  'INIT_SWAP',
  'COIN_SELECTION',
  'ENTER_AMOUNT'
}

export type SwapSideType = 'BASE' | 'COUNTER'

// state
export type SwapState = {
  quote: RemoteDataType<string, { quote: SwapQuoteType; rate: number }>
  side: SwapSideType
  step: keyof typeof SwapStepType
}

// actions
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
  | { options: { side: 'BASE' | 'COUNTER' }; step: 'COIN_SELECTION' }

export type SwapActionTypes =
  | FetchQuoteFailureActionType
  | FetchQuoteLoadingActionType
  | FetchQuoteSuccessActionType
  | SetSwapStepActionType
