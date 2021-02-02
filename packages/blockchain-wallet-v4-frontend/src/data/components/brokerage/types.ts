import {
  BankTransferAccountType, // TODO: move to Brokerage core types
  RemoteDataType
} from 'core/types'

import * as AT from './actionTypes'

export type FastLinkType = {
  attributes: {
    fastlinkParams: {
      configName: 'Verification'
    }
    fastlinkUrl: string
    token: string
    tokenExpiresAt: string
  }
  id: string
  partner: 'YODLEE'
}

export type BankStatusType =
  | 'ACTIVE'
  | 'BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND'
  | 'BANK_TRANSFER_ACCOUNT_ALREADY_LINKED'
  | 'BANK_TRANSFER_ACCOUNT_NAME_MISMATCH'
  | 'DEFAULT_ERROR'

export type BrokerageStepPayload =
  | {
      account: BankTransferAccountType
      step: BankStepType.SHOW_BANK
    }
  | {
      account: BankTransferAccountType
      redirectBackToStep?: BankStepType.SHOW_BANK
      step: BankStepType.REMOVE_BANK
    }
  | {
      step: BankStepType.LINK_BANK | BankStepType.DEFAULT
    }

export enum BankStepType {
  DEFAULT = 'DEFAULT',
  LINK_BANK = 'LINK_BANK',
  REMOVE_BANK = 'REMOVE_BANK',
  SHOW_BANK = 'SHOW_BANK'
}

export enum BrokerageModalOriginType {
  BANK = 'BankDetailsModal'
}

// State
export type BrokerageState = {
  account: BankTransferAccountType | undefined
  bankTransferAccounts: RemoteDataType<string, Array<BankTransferAccountType>>
  fastLink: RemoteDataType<string, FastLinkType>
  redirectBackToStep: BankStepType.SHOW_BANK | undefined
  step: BankStepType
}

interface FetchFastLinkType {
  type: typeof AT.FETCH_FAST_LINK
}

interface FetchBankTransferAccountsFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_BANK_TRANSFER_ACCOUNTS_ERROR
}
interface FetchBankTransferAccountsLoading {
  type: typeof AT.FETCH_BANK_TRANSFER_ACCOUNTS_LOADING
}

interface FetchBankTransferAccountsSuccess {
  payload: {
    accounts: BankTransferAccountType[]
  }
  type: typeof AT.FETCH_BANK_TRANSFER_ACCOUNTS_SUCCESS
}

interface FetchBTUpdateLoading {
  type: typeof AT.FETCH_BANK_TRANSFER_UPDATE_LOADING
}

interface SetFastLinkAction {
  payload: { fastLink: FastLinkType }
  type: typeof AT.SET_FAST_LINK
}

interface SetStepAction {
  payload: BrokerageStepPayload
  type: typeof AT.SET_STEP
}

export type BrokerageActionTypes =
  | FetchBankTransferAccountsFailure
  | FetchBankTransferAccountsLoading
  | FetchBankTransferAccountsSuccess
  | FetchBTUpdateLoading
  | FetchFastLinkType
  | SetFastLinkAction
  | SetStepAction
