import * as AT from './actionTypes'
import { BankStepType, BrokerageActionTypes, BrokerageState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: BrokerageState = {
  bankTransferAccounts: Remote.NotAsked,
  fastLink: Remote.NotAsked,
  step: BankStepType.DEFAULT,
  account: undefined,
  redirectBackToStep: undefined
}

export function brokerageReducer (
  state = INITIAL_STATE,
  action: BrokerageActionTypes
): BrokerageState {
  switch (action.type) {
    case AT.FETCH_BANK_TRANSFER_ACCOUNTS_LOADING:
      return {
        ...state,
        bankTransferAccounts: Remote.Loading
      }
    case AT.FETCH_BANK_TRANSFER_ACCOUNTS_SUCCESS:
      const accounts = action.payload.accounts.filter(
        a => a.state !== 'PENDING' && a.state !== 'BLOCKED'
      )
      return {
        ...state,
        bankTransferAccounts: Remote.Success(accounts)
      }
    case AT.FETCH_BANK_TRANSFER_ACCOUNTS_ERROR: {
      return {
        ...state,
        bankTransferAccounts: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_BANK_TRANSFER_UPDATE_LOADING:
      return {
        ...state,
        fastLink: Remote.Loading
      }
    case AT.SET_FAST_LINK:
      return {
        ...state,
        fastLink: Remote.Success(action.payload.fastLink)
      }
    case AT.SET_STEP:
      switch (action.payload.step) {
        case BankStepType.REMOVE_BANK:
          return {
            ...state,
            account: action.payload.account,
            step: action.payload.step,
            redirectBackToStep: action.payload.redirectBackToStep
          }
        case BankStepType.SHOW_BANK:
          return {
            ...state,
            account: action.payload.account,
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
