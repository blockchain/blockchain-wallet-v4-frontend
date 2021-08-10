import { FiatType, RemoteDataType, SBPaymentTypes, WalletCurrencyType } from 'core/types'

export enum ActionEnum {
  BUY = 'BUY',
  DEPOSIT = 'DEPOSIT',
  SELL = 'SELL',
  SWAP = 'SWAP',
  WITHDRAWAL = 'WITHDRAWAL'
}

// state
export type RecurringBuyState = {
  active?: RecurringBuyRegisteredList
  methods: RemoteDataType<string, RecurringBuyPeriods[]>
  period: RecurringBuyPeriods
  registeredList: RemoteDataType<string, RecurringBuyRegisteredList[]>
  step: RecurringBuyStepType
}

export enum RecurringBuyStepType {
  'INIT_PAGE',
  'GET_STARTED',
  'FREQUENCY',
  'CHECKOUT_CONFIRM',
  'SUMMARY',
  'FAILURE',
  'DETAILS',
  'REMOVE_CONFIRM'
}

export type RecurringBuyStepPayload = {
  step: RecurringBuyStepType
}

export enum RecurringBuyItemState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type RecurringBuyRegisteredList = {
  destinationCurrency: WalletCurrencyType
  id: string
  inputCurrency: FiatType
  inputValue: string
  insertedAt: string
  nextPayment: string
  paymentMethod: SBPaymentTypes
  paymentMethodId: string | null
  period: RecurringBuyPeriods
  state: RecurringBuyItemState
  updatedAt: string
  userId: string
}

export enum RecurringBuyPeriods {
  BI_WEEKLY = 'BI_WEEKLY',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  ONE_TIME = 'ONE_TIME',
  WEEKLY = 'WEEKLY'
}
