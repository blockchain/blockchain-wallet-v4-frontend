import * as AT from './actionTypes'
import { AddBankStepType, BrokerageActionTypes, BrokerageState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: BrokerageState = {
  bankTransferAccounts: Remote.NotAsked,
  fastLink: Remote.NotAsked,
  step: AddBankStepType.ADD_BANK,
  account: undefined,
  redirectBackToStep: false,
  bankStatus: Remote.NotAsked
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
    case AT.SET_BANK_DETAILS:
      return {
        ...state,
        account: action.payload.account,
        redirectBackToStep: action.payload.redirectBackToStep || false
      }
    case AT.SET_STEP:
      switch (action.payload.step) {
        case AddBankStepType.ADD_BANK_STATUS:
          return {
            ...state,
            bankStatus: Remote.Success(action.payload.bankStatus),
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
