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

export enum BankDepositStepType {
  ADD_BANK = 'ADD_BANK',
  BANK_LIST = 'BANK_LIST',
  CONFIRM = 'CONFIRM',
  DEPOSIT_METHODS = 'DEPOSIT_METHODS',
  DEPOSIT_STATUS = 'DEPOSIT_STATUS',
  ENTER_AMOUNT = 'ENTER_AMOUNT'
}

export type BrokerageStepPayload =
  | {
      step:
        | AddBankStepType.ADD_BANK
        | AddBankStepType.ADD_BANK_HANDLER
        | BankDepositStepType.DEPOSIT_METHODS
        | BankDepositStepType.ENTER_AMOUNT
    }
  | {
      bankStatus: BankStatusType
      step: AddBankStepType.ADD_BANK_STATUS
    }

export type BankDetailsPayload = {
  account: BankTransferAccountType
  redirectBackToStep?: boolean
}

export enum AddBankStepType {
  ADD_BANK = 'ADD_BANK',
  ADD_BANK_HANDLER = 'ADD_BANK_HANDLER',
  ADD_BANK_STATUS = 'ADD_BANK_STATUS'
}

export enum BrokerageModalOriginType {
  ADD_BANK = 'AddBankModal',
  BANK = 'BankDetailsModal',
  DEPOSIT_BUTTON = 'DepositButton'
}

// State
export type BrokerageState = {
  account: BankTransferAccountType | undefined
  bankStatus: RemoteDataType<string, BankStatusType>
  bankTransferAccounts: RemoteDataType<string, Array<BankTransferAccountType>>
  fastLink: RemoteDataType<string, FastLinkType>
  redirectBackToStep: boolean
  step: AddBankStepType | BankDepositStepType
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
interface SetBankAccountAction {
  payload: BankDetailsPayload
  type: typeof AT.SET_BANK_DETAILS
}

export type BrokerageActionTypes =
  | FetchBankTransferAccountsFailure
  | FetchBankTransferAccountsLoading
  | FetchBankTransferAccountsSuccess
  | FetchBTUpdateLoading
  | FetchFastLinkType
  | SetFastLinkAction
  | SetStepAction
  | SetBankAccountAction
