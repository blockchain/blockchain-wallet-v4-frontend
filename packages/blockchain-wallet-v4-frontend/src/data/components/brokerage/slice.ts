/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import {
  CrossBorderLimits,
  CrossBorderLimitsPayload,
  NabuMoneyFloatType,
  WalletFiatType
} from '@core/types'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import { ModalNameType } from 'data/modals/types'
import { BankTransferAccountType } from 'data/types'

import {
  AddBankStepType,
  BankCredentialsType,
  BankDetailsPayload,
  BankDWStepType,
  BrokerageAddBankStepPayload,
  BrokerageDWStepPayload,
  BrokerageModalOriginType,
  BrokerageState,
  DepositTerms,
  PlaidAccountType,
  PlaidSettlementErrorReasons,
  YodleeAccountType
} from './types'

const initialState: BrokerageState = {
  account: undefined,
  addBankStep: AddBankStepType.ADD_BANK,
  addNew: false,
  bankCredentials: Remote.NotAsked,
  bankStatus: Remote.NotAsked,
  bankTransferAccounts: Remote.NotAsked,
  crossBorderLimits: Remote.NotAsked,
  depositTerms: Remote.NotAsked,
  dwStep: BankDWStepType.DEPOSIT_METHODS,
  fiatCurrency: undefined,
  isFlow: false,
  reason: undefined,
  redirectBackToStep: false
}

const brokerageSlice = createSlice({
  initialState,
  name: 'brokerage',
  reducers: {
    createFiatDeposit: () => {},
    deleteSavedBank: (state, action: PayloadAction<BankTransferAccountType['id']>) => {},
    fetchBankLinkCredentials: (state, action: PayloadAction<WalletFiatType>) => {},
    fetchBankLinkCredentialsError: (state, action: PayloadAction<string | Error>) => {
      state.bankCredentials = Remote.Failure(action.payload)
    },
    fetchBankLinkCredentialsLoading: (state) => {
      state.bankCredentials = Remote.Loading
    },
    fetchBankRefreshCredentials: (state, action: PayloadAction<string>) => {},
    fetchBankTransferAccounts: () => {},
    fetchBankTransferAccountsError: (
      state,
      action: PayloadAction<PartialClientErrorProperties>
    ) => {
      state.bankTransferAccounts = Remote.Failure(action.payload)
    },
    fetchBankTransferAccountsLoading: (state) => {
      state.bankCredentials = Remote.Loading
    },
    fetchBankTransferAccountsSuccess: (state, action: PayloadAction<BankTransferAccountType[]>) => {
      const accounts = action.payload.filter((a) => a.state !== 'PENDING' && a.state !== 'BLOCKED')
      state.bankTransferAccounts = Remote.Success(accounts)
    },
    fetchBankTransferUpdate: (
      state,
      action: PayloadAction<PlaidAccountType | YodleeAccountType | string>
    ) => {},

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

    fetchDepositTerms: (
      state,
      action: PayloadAction<{
        amount: NabuMoneyFloatType
        paymentMethodId: string
      }>
    ) => {},
    fetchDepositTermsFailure: (state, action: PayloadAction<string>) => {
      state.depositTerms = Remote.Failure(action.payload)
    },
    fetchDepositTermsLoading: (state) => {
      state.depositTerms = Remote.Loading
    },
    fetchDepositTermsSuccess: (state, action: PayloadAction<DepositTerms>) => {
      state.depositTerms = Remote.Success(action.payload)
    },

    handleDepositFiatClick: (state, action: PayloadAction<WalletFiatType>) => {
      state.fiatCurrency = action.payload
    },
    handleWithdrawClick: (state, action: PayloadAction<WalletFiatType>) => {},
    paymentAccountCheck: (
      state,
      action: PayloadAction<{ amount: string; paymentMethodId?: string }>
    ) => {},
    paymentAccountRefreshSkipped: () => {},
    paymentAccountRefreshed: () => {},
    setAddBankStep: (state, action: PayloadAction<BrokerageAddBankStepPayload>) => {
      state.addBankStep = action.payload.addBankStep
      if (action.payload.addBankStep === AddBankStepType.ADD_BANK_STATUS) {
        state.bankStatus = Remote.Success(action.payload.bankStatus)
      }
    },
    setBankCredentials: (state, action: PayloadAction<BankCredentialsType>) => {
      state.bankCredentials = Remote.Success(action.payload)
    },
    setBankDetails: (state, action: PayloadAction<BankDetailsPayload>) => {
      state.account = action.payload.account
      state.redirectBackToStep = action.payload.redirectBackToStep || false
    },
    setDWStep: (state, action: PayloadAction<BrokerageDWStepPayload>) => {
      state.dwStep = action.payload.dwStep
      switch (action.payload.dwStep) {
        case BankDWStepType.DEPOSIT_METHODS:
          // Keeping for now (10/5/22) but I think we can deprecate addNew functionality
          state.addNew = action.payload.addNew || false
          break
        case BankDWStepType.PAYMENT_ACCOUNT_ERROR:
          state.reason = action.payload.reason
          break
        default:
          break
      }
    },
    setReason: (state, action: PayloadAction<PlaidSettlementErrorReasons | undefined>) => {
      state.reason = action.payload
    },
    setupBankTransferProvider: () => {},
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
  showModal
} = brokerageSlice.actions
const { actions } = brokerageSlice
const brokerageReducer = brokerageSlice.reducer
export { actions, brokerageReducer }
