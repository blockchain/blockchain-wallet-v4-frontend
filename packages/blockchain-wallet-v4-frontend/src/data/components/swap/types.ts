import * as AT from './actionTypes'
import { CoinType } from 'core/types'

export type SwapCoinType = Exclude<CoinType, 'ALGO'>

export enum SwapStepType {
  'INIT_SWAP',
  'COIN_SELECTION'
}

export type SwapSideType = 'BASE' | 'COUNTER'

// state
export type SwapState = {
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
      step: 'INIT_SWAP'
    }
  | { options: { side: 'BASE' | 'COUNTER' }; step: 'COIN_SELECTION' }

export type SwapActionTypes = SetSwapStepActionType
