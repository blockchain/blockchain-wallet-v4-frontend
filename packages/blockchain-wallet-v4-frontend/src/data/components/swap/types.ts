import * as AT from './actionTypes'
import { CoinType } from 'core/types'

export enum SwapStepType {
  'ENTER_AMOUNT',
  'COIN_SELECTION'
}

export type SwapSideType = 'BASE' | 'COUNTER'

// state
export type SwapState = {
  baseCurrency: CoinType
  counterCurrency: CoinType
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
      options: {}
      step: 'ENTER_AMOUNT'
    }
  | { options: { side: 'BASE' | 'COUNTER' }; step: 'COIN_SELECTION' }

export type SwapActionTypes = SetSwapStepActionType
