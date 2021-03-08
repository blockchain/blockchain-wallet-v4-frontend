import {
  BankTransferAccountType,
  YodleeAccountType
} from 'blockchain-wallet-v4/src/types'

import { BrokerageModalOriginType, ModalNamesType } from 'data/types'
import * as AT from './actionTypes'
import {
  AddBankStepType,
  BankDetailsPayload,
  BrokerageActionTypes,
  BrokerageStepPayload,
  FastLinkType
} from './types'

export const deleteSavedBank = (bankId: BankTransferAccountType['id']) => ({
  type: AT.DELETE_SAVED_BANK,
  bankId
})

export const setFastLink = (fastLink: FastLinkType): BrokerageActionTypes => ({
  type: AT.SET_FAST_LINK,
  payload: {
    fastLink
  }
})

export const fetchBankTransferUpdate = (accounts: YodleeAccountType[]) => ({
  type: AT.FETCH_BANK_TRANSFER_UPDATE,
  accounts
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

export const fetchFastLink = (): BrokerageActionTypes => ({
  type: AT.FETCH_FAST_LINK
})

export const setStep = (
  payload: BrokerageStepPayload
): BrokerageActionTypes => ({
  type: AT.SET_STEP,
  payload: getPayloadObjectForStep(payload)
})

export const setBankDetails = (
  payload: BankDetailsPayload
): BrokerageActionTypes => ({
  type: AT.SET_BANK_DETAILS,
  payload: payload
})

const getPayloadObjectForStep = (payload: BrokerageStepPayload) => {
  switch (payload.step) {
    case AddBankStepType.ADD_BANK_STATUS:
      return {
        step: payload.step,
        bankStatus: payload.bankStatus
      }
    default:
      return { step: payload.step }
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
