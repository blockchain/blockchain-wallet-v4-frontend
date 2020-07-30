import * as AT from './actionTypes'
import { WithdrawActionTypes, WithdrawState } from './types'

const INITIAL_STATE: WithdrawState = {
  fiatCurrency: 'EUR',
  step: 'ENTER_AMOUNT'
}

export function withdrawReducer (
  state = INITIAL_STATE,
  action: WithdrawActionTypes
): WithdrawState {
  switch (action.type) {
    case AT.SET_STEP:
      switch (action.payload.step) {
        case 'ENTER_AMOUNT':
          return {
            ...state,
            fiatCurrency: action.payload.fiatCurrency
          }
        default:
          return {
            ...state,
            step: action.payload.step
          }
      }
    default:
      return state
  }
}
