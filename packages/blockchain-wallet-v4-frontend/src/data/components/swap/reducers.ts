import * as AT from './actionTypes'
import { SwapActionTypes, SwapState } from './types'

const INITIAL_STATE: SwapState = {
  BASE: {
    coin: 'BTC'
  },
  COUNTER: {
    coin: 'ETH'
  },
  side: 'BASE',
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
          return action.payload.options
            ? {
                ...state,
                step: action.payload.step,
                [action.payload.options.side]: {
                  account: action.payload.options.account,
                  coin: action.payload.options.coin
                }
              }
            : {
                ...state,
                step: action.payload.step
              }
        case 'COIN_SELECTION':
          return {
            ...state,
            step: action.payload.step,
            side: action.payload.options.side
          }
      }
      break
    default:
      return state
  }
}
