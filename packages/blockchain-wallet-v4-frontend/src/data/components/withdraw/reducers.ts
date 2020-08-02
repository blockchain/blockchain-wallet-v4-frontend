import * as AT from './actionTypes'
import { WithdrawActionTypes, WithdrawState } from './types'

const INITIAL_STATE: WithdrawState = {
  amount: undefined,
  beneficiary: undefined,
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
            beneficiary: action.payload.beneficiary,
            fiatCurrency: action.payload.fiatCurrency,
            step: action.payload.step
          }
        case 'BANK_PICKER':
          return {
            ...state,
            fiatCurrency: action.payload.fiatCurrency,
            step: action.payload.step
          }
        case 'CONFIRM_WITHDRAW': {
          return {
            ...state,
            amount: action.payload.amount,
            beneficiary: action.payload.beneficiary,
            step: action.payload.step
          }
        }
      }
      break
    default:
      return state
  }
}
