import Remote from '@core/remote'

import * as AT from './actionTypes'
import { WithdrawActionTypes, WithdrawState, WithdrawStepEnum } from './types'

const INITIAL_STATE: WithdrawState = {
  amount: undefined,
  beneficiary: undefined,
  crossBorderLimits: Remote.NotAsked,
  feesAndMinAmount: Remote.NotAsked,
  fiatCurrency: 'EUR',
  step: WithdrawStepEnum.ENTER_AMOUNT,
  withdrawLocks: Remote.NotAsked,
  withdrawal: undefined
}

export function withdrawReducer(state = INITIAL_STATE, action: WithdrawActionTypes): WithdrawState {
  switch (action.type) {
    case AT.SET_STEP:
      switch (action.payload.step) {
        case WithdrawStepEnum.ENTER_AMOUNT:
          return {
            ...state,
            beneficiary: action.payload.beneficiary,
            fiatCurrency: action.payload.fiatCurrency,
            step: action.payload.step
          }
        case WithdrawStepEnum.WITHDRAWAL_METHODS:
        case WithdrawStepEnum.BANK_PICKER:
          return {
            ...state,
            fiatCurrency: action.payload.fiatCurrency,
            step: action.payload.step
          }
        case WithdrawStepEnum.CONFIRM_WITHDRAW: {
          return {
            ...state,
            amount: action.payload.amount,
            beneficiary: action.payload.beneficiary,
            step: action.payload.step
          }
        }
        case WithdrawStepEnum.WITHDRAWAL_DETAILS: {
          return {
            ...state,
            step: action.payload.step,
            withdrawal: action.payload.withdrawal
          }
        }
        default:
          return {
            ...state,
            step: action.payload.step
          }
      }
    case AT.FETCH_WITHDRAWAL_FEES_LOADING: {
      return {
        ...state,
        feesAndMinAmount: Remote.Loading
      }
    }
    case AT.FETCH_WITHDRAWAL_FEES_SUCCESS: {
      return {
        ...state,
        feesAndMinAmount: Remote.Success(action.payload.withdrawFeesResponse)
      }
    }
    case AT.FETCH_WITHDRAWAL_FEES_FAILURE: {
      return {
        ...state,
        feesAndMinAmount: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_WITHDRAWAL_LOCK_LOADING: {
      return {
        ...state,
        withdrawLocks: Remote.Loading
      }
    }
    case AT.FETCH_WITHDRAWAL_LOCK_SUCCESS: {
      return {
        ...state,
        withdrawLocks: Remote.Success(action.payload.withdrawLockResponse)
      }
    }
    case AT.FETCH_WITHDRAWAL_LOCK_FAILURE: {
      return {
        ...state,
        withdrawLocks: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_WITHDRAWAL_CROSBSORDER_LIMITS_LOADING: {
      return {
        ...state,
        crossBorderLimits: Remote.Loading
      }
    }
    case AT.FETCH_WITHDRAWAL_CROSBSORDER_LIMITS_SUCCESS: {
      return {
        ...state,
        crossBorderLimits: Remote.Success(action.payload)
      }
    }
    case AT.FETCH_WITHDRAWAL_CROSBSORDER_LIMITS_FAILURE: {
      return {
        ...state,
        crossBorderLimits: Remote.Failure(action.payload)
      }
    }
    default:
      return state
  }
}
