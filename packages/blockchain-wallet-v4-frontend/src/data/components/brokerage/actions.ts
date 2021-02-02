import * as AT from './actionTypes'
import { BankTransferAccountType, YodleeAccountType } from 'core/types'

import {
  BankStepType,
  BrokerageActionTypes,
  BrokerageStepPayload,
  FastLinkType
} from './types'
import { BrokerageModalOriginType } from 'data/types'

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

const getPayloadObjectForStep = (payload: BrokerageStepPayload) => {
  switch (payload.step) {
    case BankStepType.SHOW_BANK:
      return {
        step: payload.step,
        account: payload.account
      }
    case BankStepType.REMOVE_BANK:
      return {
        step: payload.step,
        account: payload.account,
        redirectBackToStep: payload.redirectBackToStep
      }
    default:
      return { step: payload.step }
  }
}

export const showModal = (origin: BrokerageModalOriginType) => ({
  type: AT.SHOW_MODAL,
  payload: {
    origin
  }
})
