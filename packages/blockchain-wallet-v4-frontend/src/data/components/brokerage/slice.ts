/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { CrossBorderLimits, CrossBorderLimitsPayload, WalletFiatType } from '@core/types'
import { ModalNameType } from 'data/modals/types'
import { BankTransferAccountType } from 'data/types'

import {
  AddBankStepType,
  BankDetailsPayload,
  BankDWStepType,
  BrokerageAddBankStepPayload,
  BrokerageDWStepPayload,
  BrokerageModalOriginType,
  BrokerageState,
  FastLinkType,
  OBType,
  YodleeAccountType
} from './types'

const initialState: BrokerageState = {
  account: undefined,
  addBankStep: AddBankStepType.ADD_BANK,
  addNew: false,
  // TODO: Put this stuff in redux-form
  bankCredentials: Remote.NotAsked,
  bankStatus: Remote.NotAsked,
  bankTransferAccounts: Remote.NotAsked,
  crossBorderLimits: Remote.NotAsked,
  dwStep: BankDWStepType.DEPOSIT_METHODS,
  fastLink: Remote.NotAsked,
  fiatCurrency: undefined,
  isFlow: false,
  redirectBackToStep: false
}

const brokerageSlice = createSlice({
  initialState,
  name: 'brokerage',
  reducers: {
    createFiatDeposit: () => {},
    deleteSavedBank: (state, action: PayloadAction<BankTransferAccountType['id']>) => {},
    fetchBTUpdateLoading: (state) => {
      state.fastLink = Remote.Loading
    },
    fetchBankLinkCredentials: (state, action: PayloadAction<WalletFiatType>) => {},
    fetchBankLinkCredentialsError: (state, action: PayloadAction<string>) => {
      state.bankCredentials = Remote.Failure(action.payload)
    },
    fetchBankLinkCredentialsLoading: (state) => {
      state.bankCredentials = Remote.Loading
    },
    fetchBankTransferAccounts: () => {},
    fetchBankTransferAccountsError: (state, action: PayloadAction<string>) => {
      state.bankTransferAccounts = Remote.Failure(action.payload)
    },
    fetchBankTransferAccountsLoading: (state) => {
      state.bankCredentials = Remote.Loading
    },
    fetchBankTransferAccountsSuccess: (state, action: PayloadAction<BankTransferAccountType[]>) => {
      const accounts = action.payload.filter((a) => a.state !== 'PENDING' && a.state !== 'BLOCKED')
      state.bankTransferAccounts = Remote.Success(accounts)
    },
    fetchBankTransferUpdate: (state, action: PayloadAction<YodleeAccountType | string>) => {},

    // cross border limits
    fetchCrossBorderLimits: (state, action: PayloadAction<CrossBorderLimitsPayload>) => {},
    fetchCrossBorderLimitsFailure: (state, action: PayloadAction<string>) => {
      state.crossBorderLimits = Remote.Failure(action.payload)
    },
    fetchCrossBorderLimitsLoading: (state) => {
      state.crossBorderLimits = Remote.Loading
    },
    fetchCrossBorderLimitsSuccess: (state, action: PayloadAction<CrossBorderLimits>) => {
      state.crossBorderLimits = Remote.Success(action.payload)
    },

    handleDepositFiatClick: (state, action: PayloadAction<WalletFiatType>) => {
      state.fiatCurrency = action.payload
    },
    handleWithdrawClick: (state, action: PayloadAction<WalletFiatType>) => {},
    setAddBankStep: (state, action: PayloadAction<BrokerageAddBankStepPayload>) => {
      state.addBankStep = action.payload.addBankStep
      if (action.payload.addBankStep === AddBankStepType.ADD_BANK_STATUS) {
        state.bankStatus = Remote.Success(action.payload.bankStatus)
      }
    },
    setBankCredentials: (state, action: PayloadAction<OBType>) => {
      state.bankCredentials = Remote.Success(action.payload)
    },
    setBankDetails: (state, action: PayloadAction<BankDetailsPayload>) => {
      state.account = action.payload.account
      state.redirectBackToStep = action.payload.redirectBackToStep || false
    },
    setDWStep: (state, action: PayloadAction<BrokerageDWStepPayload>) => {
      state.dwStep = action.payload.dwStep
      if (action.payload.dwStep === BankDWStepType.DEPOSIT_METHODS) {
        state.addNew = action.payload.addNew || false
      }
    },
    setFastLink: (state, action: PayloadAction<FastLinkType>) => {
      state.fastLink = Remote.Success(action.payload)
    },
    showModal: (
      state,
      action: PayloadAction<{
        isFlow?: boolean
        modalType: ModalNameType
        origin: BrokerageModalOriginType
      }>
    ) => {
      state.isFlow = action.payload.isFlow || false
    }
  }
})

export const {
  createFiatDeposit,
  deleteSavedBank,
  fetchBTUpdateLoading,
  fetchBankLinkCredentials,
  fetchBankLinkCredentialsError,
  fetchBankLinkCredentialsLoading,
  fetchBankTransferAccounts,
  fetchBankTransferAccountsError,
  fetchBankTransferAccountsLoading,
  fetchBankTransferAccountsSuccess,
  fetchBankTransferUpdate,
  handleDepositFiatClick,
  handleWithdrawClick,
  setAddBankStep,
  setBankCredentials,
  setBankDetails,
  setDWStep,
  setFastLink,
  showModal
} = brokerageSlice.actions
const { actions } = brokerageSlice
const brokerageReducer = brokerageSlice.reducer
export { actions, brokerageReducer }
