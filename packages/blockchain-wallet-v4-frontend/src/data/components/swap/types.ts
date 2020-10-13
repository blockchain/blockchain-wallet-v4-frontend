import * as AT from './actionTypes'
import { CoinType } from 'core/types'
import { SwapAccountType } from '../exchange/types'

export type SwapCoinType = Exclude<CoinType, 'ALGO'>

export enum SwapStepType {
  'ENTER_AMOUNT',
  'COIN_SELECTION'
}

export type SwapSideType = 'BASE' | 'COUNTER'

// state
export type SwapState = {
  BASE: {
    account?: SwapAccountType
    coin: SwapCoinType
  }
  COUNTER: {
    account?: SwapAccountType
    coin: SwapCoinType
  }
  side: SwapSideType
  step: keyof typeof SwapStepType
}

// actions
interface SetSwapStepActionType {
  payload: SwapStepPayload
  type: typeof AT.SET_STEP
}

export type SwapStepPayload =
  | {
      options: {
        account: SwapAccountType
        coin: SwapCoinType
        side: SwapSideType
      } | null
      step: 'ENTER_AMOUNT'
    }
  | { options: { side: 'BASE' | 'COUNTER' }; step: 'COIN_SELECTION' }

export type SwapActionTypes = SetSwapStepActionType
