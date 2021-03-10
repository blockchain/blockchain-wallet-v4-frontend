import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { WithdrawActionTypes, WithdrawState, WithdrawStepEnum } from './types'

const INITIAL_STATE: WithdrawState = {
  amount: undefined,
  beneficiary: undefined,
  fiatCurrency: 'EUR',
  step: WithdrawStepEnum.ENTER_AMOUNT,
  withdrawal: undefined,
  feesAndMinAmount: Remote.NotAsked,
  withdrawLocks: Remote.NotAsked
}

export function withdrawReducer(
  state = INITIAL_STATE,
  action: WithdrawActionTypes
): WithdrawState {
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
    default:
      return state
  }
}
