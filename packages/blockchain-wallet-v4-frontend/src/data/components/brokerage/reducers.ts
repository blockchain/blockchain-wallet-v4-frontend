import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import {
  AddBankStepType,
  BankDWStepType,
  BrokerageActionTypes,
  BrokerageState
} from './types'

const INITIAL_STATE: BrokerageState = {
  bankTransferAccounts: Remote.NotAsked,
  fastLink: Remote.NotAsked,
  addBankStep: AddBankStepType.ADD_BANK,
  dwStep: BankDWStepType.DEPOSIT_METHODS,
  account: undefined,
  redirectBackToStep: false,
  addNew: false, // TODO: Put this stuff in redux-form
  bankStatus: Remote.NotAsked,
  fiatCurrency: undefined
}

export function brokerageReducer(
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
    case AT.HANDLE_DEPOSIT_FIAT_CLICK:
      return {
        ...state,
        fiatCurrency: action.payload.fiatCurrency
      }
    case AT.SET_ADD_BANK_STEP:
      switch (action.payload.addBankStep) {
        case AddBankStepType.ADD_BANK_STATUS:
          return {
            ...state,
            bankStatus: Remote.Success(action.payload.bankStatus),
            addBankStep: action.payload.addBankStep
          }
        default: {
          return {
            ...state,
            addBankStep: action.payload.addBankStep
          }
        }
      }
    case AT.SET_D_W_STEP:
      switch (action.payload.dwStep) {
        case BankDWStepType.DEPOSIT_METHODS:
          return {
            ...state,
            dwStep: action.payload.dwStep,
            addNew: action.payload.addNew || false
          }
        default:
          return {
            ...state,
            dwStep: action.payload.dwStep
          }
      }
    default:
      return state
  }
}
