import {
  BSTransactionType,
  CrossBorderLimits,
  FiatType,
  RemoteDataType,
  WalletFiatType
} from '@core/types'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import { NabuError } from 'services/errors'

export enum BankPartners {
  PLAID = 'PLAID',
  YAPILY = 'YAPILY',
  YODLEE = 'YODLEE'
}

export enum OBEntityType {
  SAFE_CONNECT_AUB = 'Safeconnect UAB',
  SAFE_CONNECT_UK = 'Safeconnect(UK)'
}

export type YodleeAttributesType = {
  fastlinkParams: {
    configName: 'Verification'
  }
  fastlinkUrl: string
  token: string
  tokenExpiresAt: string
}

export type FastLinkType = {
  attributes: YodleeAttributesType
  id: string
  partner: BankPartners.YODLEE
}

export type OBType = {
  attributes: OBAttributesType
  id: string
  partner: BankPartners.YAPILY
}

export type PlaidAttributesType = {
  link_token: string
  tokenExpiresAt: string
}

export type BankCredentialsType = {
  id: string
} & (
  | { attributes: OBAttributesType; partner: BankPartners.YAPILY }
  | { attributes: PlaidAttributesType; partner: BankPartners.PLAID }
  | { attributes: YodleeAttributesType; partner: BankPartners.YODLEE }
)

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
  BANK_TRANSFER_ACCOUNT_FAILED_INTERNAL = 'BANK_TRANSFER_ACCOUNT_FAILED_INTERNAL',
  BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND = 'BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND',
  BANK_TRANSFER_ACCOUNT_INVALID = 'BANK_TRANSFER_ACCOUNT_INVALID',
  BANK_TRANSFER_ACCOUNT_NAME_MISMATCH = 'BANK_TRANSFER_ACCOUNT_NAME_MISMATCH',
  BANK_TRANSFER_ACCOUNT_NOT_SUPPORTED = 'BANK_TRANSFER_ACCOUNT_NOT_SUPPORTED',
  BANK_TRANSFER_ACCOUNT_REJECTED = 'BANK_TRANSFER_ACCOUNT_REJECTED',
  BANK_TRANSFER_ACCOUNT_REJECTED_FRAUD = 'BANK_TRANSFER_ACCOUNT_REJECTED_FRAUD',
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
  PAYMENT_ACCOUNT_ERROR = 'PAYMENT_ACCOUNT_ERROR',
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
      dwStep: BankDWStepType.PAYMENT_ACCOUNT_ERROR
      reason: PlaidSettlementErrorReasons
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
        | AddBankStepType.LOADING
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
  requiresRefresh?: true
}

export type BankTransferAccountType = {
  addedAt: string
  attributes: BankTransferAccountAttrs
  capabilities?: {
    deposit: {
      enabled: boolean
      ux?: NabuError
    }
    withdrawal: {
      enabled: boolean
      ux?: NabuError
    }
  }
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

export type PlaidAccountType = {
  account_id: string
  public_token: string
}

export type PlaidSettlementErrorReasons =
  | 'INSUFFICIENT_BALANCE'
  | 'STALE_BALANCE'
  | 'GENERIC'
  | 'REQUIRES_UPDATE'

export enum AddBankStepType {
  ADD_BANK = 'ADD_BANK',
  ADD_BANK_AUTHORIZE = 'ADD_BANK_AUTHORIZE',
  ADD_BANK_CONNECT = 'ADD_BANK_CONNECT',
  ADD_BANK_HANDLER = 'ADD_BANK_HANDLER',
  ADD_BANK_STATUS = 'ADD_BANK_STATUS',
  LOADING = 'LOADING'
}

export enum BrokerageModalOriginType {
  ADD_BANK_BUY = 'AddBankModalBuy',
  ADD_BANK_DEPOSIT = 'AddBankModalDeposit',
  ADD_BANK_SETTINGS = 'AddBankModalSettings',
  ADD_BANK_WITHDRAW = 'AddBankModalWithdraw',
  BANK = 'BankDetailsModal',
  DEPOSIT_BUTTON = 'BankDeposit',
  DW = 'DepositWithdrawalModal',
  TRADE = 'Trade',
  WITHDRAWAL = 'WithdrawModal'
}

export enum BrokerageOrderType {
  BUY = 'BUY',
  DEPOSIT = 'DEPOSIT',
  SELL = 'SELL',
  SWAP = 'SWAP',
  WITHDRAW = 'WITHDRAW'
}

export type BrokerageTxFormValuesType =
  | {
      amount?: number
      currency?: FiatType
      order?: BSTransactionType
      retryTimeout?: boolean
    }
  | undefined

// State
export type BrokerageState = {
  account: BankTransferAccountType | undefined
  addBankStep: AddBankStepType
  addNew: boolean
  bankCredentials: RemoteDataType<string | Error, BankCredentialsType>
  bankStatus: RemoteDataType<string, BankStatusType>
  bankTransferAccounts: RemoteDataType<PartialClientErrorProperties, Array<BankTransferAccountType>>
  crossBorderLimits: RemoteDataType<string, CrossBorderLimits>
  depositTerms: RemoteDataType<string, DepositTerms>
  dwStep: BankDWStepType
  fiatCurrency: WalletFiatType | undefined
  isFlow: boolean
  reason: PlaidSettlementErrorReasons | undefined
  redirectBackToStep: boolean
}

export enum DisplayMode {
  DAY_RANGE = 'DAY_RANGE',
  IMMEDIATELY = 'IMMEDIATELY',
  MAX_DAY = 'MAX_DAY',
  MAX_MINUTE = 'MAX_MINUTE',
  MINUTE_RANGE = 'MINUTE_RANGE',
  NONE = 'NONE'
}

export enum SettlementType {
  INSTANT = 'INSTANT',
  REGULAR = 'REGULAR',
  UNAVAILABLE = 'UNAVAILABLE'
}

export enum SettlementReason {
  GENERIC = 'GENERIC',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  REQUIRES_UPDATE = 'REQUIRES_UPDATE',
  STALE_BALANCE = 'STALE_BALANCE'
}

export type DepositTerms = {
  availableToTradeDisplayMode: DisplayMode
  availableToTradeMinutesMax: number
  availableToTradeMinutesMin: number
  availableToWithdrawDisplayMode: DisplayMode
  availableToWithdrawMinutesMax: number
  availableToWithdrawMinutesMin: number
  creditCurrency: FiatType
  settlementReason: SettlementReason
  settlementType: SettlementType
  withdrawalLockDays: number
}
