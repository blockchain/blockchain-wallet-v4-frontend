import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

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
import { BankTransferAccountType } from 'data/types'
import { WalletFiatType } from 'core/types'
import { ModalNamesType } from 'data/modals/types'

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

const brokerageSlice = createSlice({
  name: 'brokerage',
  initialState: INITIAL_STATE,
  reducers: {
    createFiatDeposit: () => {},
    deleteSavedBank: (state, action: PayloadAction<BankTransferAccountType['id']>) => {},
    handleWithdrawClick: (state, action: PayloadAction<WalletFiatType>) => {},
    fetchBankLinkCredentials: (state, action: PayloadAction<WalletFiatType>) => {},
    fetchBankLinkCredentialsLoading: (state) => {
      state.bankCredentials = Remote.Loading
    },
    fetchBankLinkCredentialsError: (state, action: PayloadAction<string>) => {
      state.bankCredentials = Remote.Failure(action.payload);
    },
    fetchBankTransferAccounts: () => {},
    fetchBankTransferAccountsLoading: (state) => {
      state.bankCredentials = Remote.Loading
    },
    fetchBankTransferAccountsSuccess: (state, action: PayloadAction<BankTransferAccountType[]>) => {
      const accounts = action.payload.filter(
        a => a.state !== 'PENDING' && a.state !== 'BLOCKED'
      )
      state.bankTransferAccounts = Remote.Success(accounts)
    },
    fetchBankTransferAccountsError: (state, action: PayloadAction<string>) => {
      state.bankTransferAccounts = Remote.Failure(action.payload)
    },
    fetchBankTransferUpdate: (state, action: PayloadAction<YodleeAccountType | string>) => {},
    fetchBTUpdateLoading: (state) => {
      state.fastLink = Remote.Loading
    },
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
      state.account = action.payload.account,
      state.redirectBackToStep = action.payload.redirectBackToStep || false
    },
    setFastLink: (state, action: PayloadAction<FastLinkType>) => {
      state.fastLink = Remote.Success(action.payload)
    },
    setDWStep: (state, action: PayloadAction<BrokerageDWStepPayload>) => {
      state.dwStep = action.payload.dwStep
      if (action.payload.dwStep === BankDWStepType.DEPOSIT_METHODS) {
        state.addNew = action.payload.addNew || false
      }
    },
    showModal: (state, action: PayloadAction<{origin: BrokerageModalOriginType, modalType: ModalNamesType}>) => {},
    handleDepositFiatClick: (state, action: PayloadAction<WalletFiatType>) => {
      state.fiatCurrency = action.payload
    },
  }
})
export const {
  createFiatDeposit,
  deleteSavedBank,
  fetchBankLinkCredentials,
  fetchBankLinkCredentialsLoading,
  fetchBankLinkCredentialsError,
  fetchBankTransferAccounts,
  fetchBankTransferAccountsLoading,
  fetchBankTransferAccountsSuccess,
  fetchBankTransferAccountsError,
  fetchBankTransferUpdate,
  fetchBTUpdateLoading,
  handleWithdrawClick,
  setAddBankStep,
  setBankCredentials,
  setBankDetails,
  setFastLink,
  setDWStep,
  showModal,
  handleDepositFiatClick
} = brokerageSlice.actions
const actions = brokerageSlice.actions
const brokerageReducer = brokerageSlice.reducer
export { brokerageReducer, actions }
