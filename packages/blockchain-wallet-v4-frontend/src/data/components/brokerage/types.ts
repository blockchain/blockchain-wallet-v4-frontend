import { FiatType, RemoteDataType, WalletFiatType } from 'core/types'

import * as AT from './actionTypes'

export enum BankPartners {
  YAPILY = 'YAPILY',
  YODLEE = 'YODLEE'
}

export enum OBEntityType {
  SAFE_CONNECT_AUB = 'Safeconnect UAB',
  SAFE_CONNECT_UK = 'Safeconnect(UK)'
}

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
  partner: BankPartners.YODLEE
}

export type OBType = {
  attributes: OBAttributesType
  id: string
  partner: BankPartners.YAPILY
}

interface OBCountryType {
  countryCode2: string
  displayName: string
}

interface OBMediaType {
  source: string
  type: 'string'
}
export interface OBInstitution {
  countries: OBCountryType[]
  credentialsType: string
  environmentType: string
  features: string[]
  fullName: string
  id: string
  media: OBMediaType[]
  name: string
}
interface OBAttributesType {
  entity: OBEntityType
  institutions: OBInstitution[]
}

export enum BankStatusType {
  ACTIVE = 'ACTIVE',
  BANK_TRANSFER_ACCOUNT_ALREADY_LINKED = 'BANK_TRANSFER_ACCOUNT_ALREADY_LINKED',
  BANK_TRANSFER_ACCOUNT_EXPIRED = 'BANK_TRANSFER_ACCOUNT_EXPIRED',
  BANK_TRANSFER_ACCOUNT_FAILED = 'BANK_TRANSFER_ACCOUNT_FAILED',
  BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND = 'BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND',
  BANK_TRANSFER_ACCOUNT_INVALID = 'BANK_TRANSFER_ACCOUNT_INVALID',
  BANK_TRANSFER_ACCOUNT_NAME_MISMATCH = 'BANK_TRANSFER_ACCOUNT_NAME_MISMATCH',
  BANK_TRANSFER_ACCOUNT_REJECTED = 'BANK_TRANSFER_ACCOUNT_REJECTED',
  DEFAULT_ERROR = 'DEFAULT_ERROR'
}

export enum BankDWStepType {
  AUTHORIZE = 'AUTHORIZE',
  BANK_LIST = 'BANK_LIST',
  CONFIRM = 'CONFIRM',
  DEPOSIT_CONNECT = 'DEPOSIT_CONNECT',
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
        | BankDWStepType.AUTHORIZE
        | BankDWStepType.CONFIRM
        | BankDWStepType.WIRE_INSTRUCTIONS
        | BankDWStepType.DEPOSIT_CONNECT
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
      addBankStep:
        | AddBankStepType.ADD_BANK
        | AddBankStepType.ADD_BANK_HANDLER
        | AddBankStepType.ADD_BANK_AUTHORIZE
        | AddBankStepType.ADD_BANK_CONNECT
    }
  | {
      addBankStep: AddBankStepType.ADD_BANK_STATUS
      bankStatus: BankStatusType
    }

export type BankDetailsPayload = {
  account: BankTransferAccountType | undefined
  redirectBackToStep?: boolean
}

export type BankDetails = {
  accountName: string
  accountNumber: string
  bankAccountType: string
  bankName: string
  routingNumber: string
}

interface BankTransferAccountAttrs {
  authorisationUrl: string
  entity: OBEntityType
  media: OBMediaType[]
  qrcodeUrl: string
}

export type BankTransferAccountType = {
  addedAt: string
  attributes: BankTransferAccountAttrs
  currency: FiatType
  details: BankDetails
  id: string
  partner: string
  state: string
}

export type YodleeAccountType = {
  accountId: string
  additionalStatus: string
  providerAccountId: number
  providerId: number
  providerName: string
  requestId: string
  status: string
}

export enum AddBankStepType {
  ADD_BANK = 'ADD_BANK',
  ADD_BANK_AUTHORIZE = 'ADD_BANK_AUTHORIZE',
  ADD_BANK_CONNECT = 'ADD_BANK_CONNECT',
  ADD_BANK_HANDLER = 'ADD_BANK_HANDLER',
  ADD_BANK_STATUS = 'ADD_BANK_STATUS',
  LOADING = 'LOADING'
}

export enum BrokerageModalOriginType {
  ADD_BANK = 'AddBankModal',
  BANK = 'BankDetailsModal',
  DEPOSIT_BUTTON = 'BankDeposit',
  DW = 'DepositWithdrawalModal',
  WITHDRAWAL = 'WithdrawModal'
}

export type BrokerageTxFormValuesType =
  | {
      amount?: number
      currency?: FiatType
    }
  | undefined

// State
export type BrokerageState = {
  account: BankTransferAccountType | undefined
  addBankStep: AddBankStepType
  addNew: boolean
  bankCredentials: RemoteDataType<string, OBType>
  bankStatus: RemoteDataType<string, BankStatusType>
  bankTransferAccounts: RemoteDataType<string, Array<BankTransferAccountType>>
  dwStep: BankDWStepType
  fastLink: RemoteDataType<string, FastLinkType>
  fiatCurrency: WalletFiatType | undefined
  redirectBackToStep: boolean
}

interface FetchBankLinkCredentialsType {
  payload: { fiatCurrency: WalletFiatType }
  type: typeof AT.FETCH_BANK_LINK_CREDENTIALS
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

interface FetchBankCredentialsSuccessAction {
  payload: { credentials: OBType }
  type: typeof AT.FETCH_BANK_CREDENTIALS_SUCCESS
}

interface FetchBankCredentialsLoadingAction {
  type: typeof AT.FETCH_BANK_CREDENTIALS_LOADING
}

interface FetchBankCredentialsErrorAction {
  payload: { error: string }
  type: typeof AT.FETCH_BANK_CREDENTIALS_ERROR
}

export type BrokerageActionTypes =
  | FetchBankCredentialsErrorAction
  | FetchBankCredentialsLoadingAction
  | FetchBankCredentialsSuccessAction
  | FetchBankTransferAccountsFailure
  | FetchBankTransferAccountsLoading
  | FetchBankTransferAccountsSuccess
  | FetchBTUpdateLoading
  | FetchBankLinkCredentialsType
  | SetFastLinkAction
  | SetAddBankStepAction
  | SetBankAccountAction
  | SetDWStepAction
  | HandeDepositFiatClickAction
