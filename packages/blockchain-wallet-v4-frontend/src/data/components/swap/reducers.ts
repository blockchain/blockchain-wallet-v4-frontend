import * as AT from './actionTypes'
import { SwapActionTypes, SwapState } from './types'

const INITIAL_STATE: SwapState = {
  baseCurrency: 'BTC',
  counterCurrency: 'ETH',
  step: 'ENTER_AMOUNT'
}

export function swapReducer (
  state = INITIAL_STATE,
  action: SwapActionTypes
): SwapState {
  switch (action.type) {
    case AT.SET_STEP:
      switch (action.payload.step) {
        case 'ENTER_AMOUNT':
          return {
            ...state,
            step: action.payload.step
          }
        default: {
          return {
            ...state,
            step: action.payload.step
          }
        }
      }
    default:
      return state
  }
}
