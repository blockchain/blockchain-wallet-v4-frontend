import {
  BankTransferAccountType,
  RemoteDataType,
  WalletFiatType
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

export enum BankDWStepType {
  BANK_LIST = 'BANK_LIST',
  CONFIRM = 'CONFIRM',
  DEPOSIT_METHODS = 'DEPOSIT_METHODS',
  DEPOSIT_STATUS = 'DEPOSIT_STATUS',
  ENTER_AMOUNT = 'ENTER_AMOUNT',
  INELIGIBLE = 'INELIGIBLE',
  LOADING = 'LOADING',
  WIRE_INSTRUCTIONS = 'WIRE_INSTRUCTIONS'
}

export type BrokerageDWStepPayload =
  | {
      dwStep:
        | BankDWStepType.ENTER_AMOUNT
        | BankDWStepType.WIRE_INSTRUCTIONS
        | BankDWStepType.DEPOSIT_STATUS
        | BankDWStepType.BANK_LIST
        | BankDWStepType.INELIGIBLE
        | BankDWStepType.LOADING
    }
  | {
      addNew?: boolean
      dwStep: BankDWStepType.DEPOSIT_METHODS
    }

export type BrokerageAddBankStepPayload =
  | {
      addBankStep: AddBankStepType.ADD_BANK | AddBankStepType.ADD_BANK_HANDLER
    }
  | {
      addBankStep: AddBankStepType.ADD_BANK_STATUS
      bankStatus: BankStatusType
    }

export type BankDetailsPayload = {
  account: BankTransferAccountType | undefined
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
  DEPOSIT_BUTTON = 'BankDeposit',
  DW = 'DepositWithdrawalModal',
  WITHDRAWAL = 'WithdrawModal'
}

// State
export type BrokerageState = {
  account: BankTransferAccountType | undefined
  addBankStep: AddBankStepType
  addNew: boolean
  bankStatus: RemoteDataType<string, BankStatusType>
  bankTransferAccounts: RemoteDataType<string, Array<BankTransferAccountType>>
  dwStep: BankDWStepType
  fastLink: RemoteDataType<string, FastLinkType>
  fiatCurrency: WalletFiatType | undefined
  redirectBackToStep: boolean
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

interface SetAddBankStepAction {
  payload: BrokerageAddBankStepPayload
  type: typeof AT.SET_ADD_BANK_STEP
}

interface SetDWStepAction {
  payload: BrokerageDWStepPayload
  type: typeof AT.SET_D_W_STEP
}
interface SetBankAccountAction {
  payload: BankDetailsPayload
  type: typeof AT.SET_BANK_DETAILS
}
interface HandeDepositFiatClickAction {
  payload: { fiatCurrency: WalletFiatType }
  type: typeof AT.HANDLE_DEPOSIT_FIAT_CLICK
}

export type BrokerageActionTypes =
  | FetchBankTransferAccountsFailure
  | FetchBankTransferAccountsLoading
  | FetchBankTransferAccountsSuccess
  | FetchBTUpdateLoading
  | FetchFastLinkType
  | SetFastLinkAction
  | SetAddBankStepAction
  | SetBankAccountAction
  | SetDWStepAction
  | HandeDepositFiatClickAction
