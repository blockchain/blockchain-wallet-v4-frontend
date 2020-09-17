import * as AT from './actionTypes'
import { WithdrawActionTypes, WithdrawState } from './types'

const INITIAL_STATE: WithdrawState = {
  amount: undefined,
  beneficiary: undefined,
  fiatCurrency: 'EUR',
  step: 'ENTER_AMOUNT',
  withdrawal: undefined,
  feesResponse: undefined,
  isLoadingFees: undefined,
  loadingFeesError: undefined
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
        case 'WITHDRAWAL_DETAILS': {
          return {
            ...state,
            step: action.payload.step,
            withdrawal: action.payload.withdrawal
          }
        }
      }
      break
    case AT.FETCH_WITHDRAWAL_FEES_LOADING: {
      return {
        ...state,
        isLoadingFees: true
      }
    }
    case AT.FETCH_WITHDRAWAL_FEES_SUCCESS: {
      return {
        ...state,
        feesResponse: action.payload.withdrawFeesRespons,
        isLoadingFees: false,
        loadingFeesError: undefined
      }
    }
    case AT.FETCH_WITHDRAWAL_FEES_FAILURE: {
      return {
        ...state,
        isLoadingFees: false,
        loadingFeesError: action.payload.error
      }
    }
    default:
      return state
  }
}
