import { WalletFiatType } from 'blockchain-wallet-v4/src/types'
import {
  BankTransferAccountType,
  BrokerageModalOriginType,
  ModalNamesType,
  YodleeAccountType
} from 'data/types'

import * as AT from './actionTypes'
import {
  AddBankStepType,
  BankDetailsPayload,
  BankDWStepType,
  BrokerageActionTypes,
  BrokerageAddBankStepPayload,
  BrokerageDWStepPayload,
  FastLinkType,
  OBType
} from './types'

const getPayloadObjectForAddBankStep = (payload: BrokerageAddBankStepPayload) => {
  switch (payload.addBankStep) {
    case AddBankStepType.ADD_BANK_STATUS:
      return {
        addBankStep: payload.addBankStep,
        bankStatus: payload.bankStatus
      }
    default:
      return { addBankStep: payload.addBankStep }
  }
}

const getPayloadObjectForDWStep = (payload: BrokerageDWStepPayload) => {
  switch (payload.dwStep) {
    case BankDWStepType.DEPOSIT_METHODS:
      return { addNew: payload.addNew || false, dwStep: payload.dwStep }
    default:
      return { dwStep: payload.dwStep }
  }
}

export const deleteSavedBank = (bankId: BankTransferAccountType['id']) => ({
  bankId,
  type: AT.DELETE_SAVED_BANK
})

export const handleDepositFiatClick = (fiatCurrency: WalletFiatType) => ({
  payload: {
    fiatCurrency
  },
  type: AT.HANDLE_DEPOSIT_FIAT_CLICK
})

export const handleWithdrawClick = (fiatCurrency: WalletFiatType) => ({
  payload: {
    fiatCurrency
  },
  type: AT.HANDLE_WITHDRAW_CLICK
})

export const setFastLink = (fastLink: FastLinkType): BrokerageActionTypes => ({
  payload: {
    fastLink
  },
  type: AT.SET_FAST_LINK
})

export const setBankCredentials = (credentials: OBType): BrokerageActionTypes => ({
  payload: {
    credentials
  },
  type: AT.FETCH_BANK_CREDENTIALS_SUCCESS
})

export const createFiatDeposit = () => ({
  type: AT.CREATE_FIAT_DEPOSIT
})

export const fetchBankTransferUpdate = (account: YodleeAccountType | string) => ({
  payload: { account },
  type: AT.FETCH_BANK_TRANSFER_UPDATE
})

export const fetchBTUpdateLoading = (): BrokerageActionTypes => ({
  type: AT.FETCH_BANK_TRANSFER_UPDATE_LOADING
})

export const fetchBankTransferAccounts = () => ({
  type: AT.FETCH_BANK_TRANSFER_ACCOUNTS
})

export const fetchBankTransferAccountsLoading = () => ({
  type: AT.FETCH_BANK_TRANSFER_ACCOUNTS_LOADING
})

export const fetchBankTransferAccountsError = (error: string) => ({
  payload: { error },
  type: AT.FETCH_BANK_TRANSFER_ACCOUNTS_ERROR
})

export const fetchBankTransferAccountsSuccess = (accounts: BankTransferAccountType[]) => ({
  payload: { accounts },
  type: AT.FETCH_BANK_TRANSFER_ACCOUNTS_SUCCESS
})

export const fetchBankLinkCredentials = (fiatCurrency: WalletFiatType): BrokerageActionTypes => ({
  payload: { fiatCurrency },
  type: AT.FETCH_BANK_LINK_CREDENTIALS
})

export const fetchBankLinkCredentialsError = (error: string) => ({
  payload: { error },
  type: AT.FETCH_BANK_CREDENTIALS_ERROR
})

export const fetchBankLinkCredentialsLoading = () => ({
  type: AT.FETCH_BANK_CREDENTIALS_LOADING
})

export const setAddBankStep = (payload: BrokerageAddBankStepPayload): BrokerageActionTypes => ({
  payload: getPayloadObjectForAddBankStep(payload),
  type: AT.SET_ADD_BANK_STEP
})

export const setDWStep = (payload: BrokerageDWStepPayload): BrokerageActionTypes => ({
  payload: getPayloadObjectForDWStep(payload),
  type: AT.SET_D_W_STEP
})

export const setBankDetails = (payload: BankDetailsPayload): BrokerageActionTypes => ({
  payload,
  type: AT.SET_BANK_DETAILS
})

export const showModal = (origin: BrokerageModalOriginType, modalType: ModalNamesType) => ({
  payload: {
    modalType,
    origin
  },
  type: AT.SHOW_MODAL
})
