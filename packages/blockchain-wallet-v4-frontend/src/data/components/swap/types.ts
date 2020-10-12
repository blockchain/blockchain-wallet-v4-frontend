import * as AT from './actionTypes'
import { CoinType } from 'core/types'

export enum SwapStepType {
  'ENTER_AMOUNT'
}

// state
export type SwapState = {
  baseCurrency: CoinType
  counterCurrency: CoinType
  step: keyof typeof SwapStepType
}

// actions
interface SetSwapStepActionType {
  payload: {
    step: keyof typeof SwapStepType
  }
  type: typeof AT.SET_STEP
}

export type SwapActionTypes = SetSwapStepActionType
