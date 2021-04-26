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

export const deleteSavedBank = (bankId: BankTransferAccountType['id']) => ({
  type: AT.DELETE_SAVED_BANK,
  bankId
})

export const handleDepositFiatClick = (fiatCurrency: WalletFiatType) => ({
  type: AT.HANDLE_DEPOSIT_FIAT_CLICK,
  payload: {
    fiatCurrency
  }
})

export const setFastLink = (fastLink: FastLinkType): BrokerageActionTypes => ({
  type: AT.SET_FAST_LINK,
  payload: {
    fastLink
  }
})

export const setBankCredentials = (
  credentials: OBType
): BrokerageActionTypes => ({
  type: AT.FETCH_BANK_CREDENTIALS_SUCCESS,
  payload: {
    credentials
  }
})

export const createFiatDeposit = () => ({
  type: AT.CREATE_FIAT_DEPOSIT
})

export const fetchBankTransferUpdate = (
  account: YodleeAccountType | string
) => ({
  type: AT.FETCH_BANK_TRANSFER_UPDATE,
  payload: { account }
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
  type: AT.FETCH_BANK_TRANSFER_ACCOUNTS_ERROR,
  payload: { error }
})

export const fetchBankTransferAccountsSuccess = (
  accounts: BankTransferAccountType[]
) => ({
  type: AT.FETCH_BANK_TRANSFER_ACCOUNTS_SUCCESS,
  payload: { accounts }
})

export const fetchBankLinkCredentials = (
  fiatCurrency: WalletFiatType
): BrokerageActionTypes => ({
  type: AT.FETCH_BANK_LINK_CREDENTIALS,
  payload: { fiatCurrency }
})

export const fetchBankLinkCredentialsError = (error: string) => ({
  type: AT.FETCH_BANK_CREDENTIALS_ERROR,
  payload: { error }
})

export const fetchBankLinkCredentialsLoading = () => ({
  type: AT.FETCH_BANK_CREDENTIALS_LOADING
})

export const setAddBankStep = (
  payload: BrokerageAddBankStepPayload
): BrokerageActionTypes => ({
  type: AT.SET_ADD_BANK_STEP,
  payload: getPayloadObjectForAddBankStep(payload)
})

export const setDWStep = (
  payload: BrokerageDWStepPayload
): BrokerageActionTypes => ({
  type: AT.SET_D_W_STEP,
  payload: getPayloadObjectForDWStep(payload)
})

export const setBankDetails = (
  payload: BankDetailsPayload
): BrokerageActionTypes => ({
  type: AT.SET_BANK_DETAILS,
  payload
})

const getPayloadObjectForAddBankStep = (
  payload: BrokerageAddBankStepPayload
) => {
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
      return { dwStep: payload.dwStep, addNew: payload.addNew || false }
    default:
      return { dwStep: payload.dwStep }
  }
}

export const showModal = (
  origin: BrokerageModalOriginType,
  modalType: ModalNamesType
) => ({
  type: AT.SHOW_MODAL,
  payload: {
    origin,
    modalType
  }
})
