import { createReducer } from '@reduxjs/toolkit'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import {
  AddBankStepType,
  BankDWStepType,
  BrokerageActionTypes,
  BrokerageState
} from './types'

const INITIAL_STATE: BrokerageState = {
  account: undefined,
  addBankStep: AddBankStepType.ADD_BANK,
  addNew: false, // TODO: Put this stuff in redux-form
  bankCredentials: Remote.NotAsked,
  bankStatus: Remote.NotAsked,
  bankTransferAccounts: Remote.NotAsked,
  dwStep: BankDWStepType.DEPOSIT_METHODS,
  fastLink: Remote.NotAsked,
  fiatCurrency: undefined,
  redirectBackToStep: false
}

// const brokerageReducer = createReducer(INITIAL_STATE, (builder) => {
//   builder
//     .addCase(AT.FETCH_BANK_CREDENTIALS_LOADING, (state) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.FETCH_BANK_CREDENTIALS_ERROR, (state, action) => {
//       state.bankCredentials = Remote.Failure(action.payload.error)
//     })
//     .addCase(AT.FETCH_BANK_CREDENTIALS_SUCCESS, (state, action) => {
//       state.bankCredentials = Remote.Success(action.payload.credentials)
//     })
//     .addCase(AT.FETCH_BANK_TRANSFER_ACCOUNTS_LOADING, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.FETCH_BANK_TRANSFER_ACCOUNTS_SUCCESS, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.FETCH_BANK_TRANSFER_ACCOUNTS_ERROR, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.FETCH_BANK_TRANSFER_UPDATE_LOADING, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.SET_FAST_LINK, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.SET_BANK_DETAILS, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.HANDLE_DEPOSIT_FIAT_CLICK, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.SET_ADD_BANK_STEP, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })
//     .addCase(AT.SET_D_W_STEP, (state, action) => {
//       state.bankCredentials = Remote.Loading
//     })

// })

export function brokerageReducer(
  state = INITIAL_STATE,
  action: BrokerageActionTypes
): BrokerageState {
  switch (action.type) {
    case AT.FETCH_BANK_CREDENTIALS_LOADING:
      return {
        ...state,
        bankCredentials: Remote.Loading
      }
    case AT.FETCH_BANK_CREDENTIALS_ERROR:
      return {
        ...state,
        bankCredentials: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_BANK_CREDENTIALS_SUCCESS:
      return {
        ...state,
        bankCredentials: Remote.Success(action.payload.credentials)
      }

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
