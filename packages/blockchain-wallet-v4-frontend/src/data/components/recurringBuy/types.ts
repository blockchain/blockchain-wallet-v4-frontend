import { RemoteDataType, SBPaymentTypes, WalletCurrencyType } from "core/types"

// state
export type RecurringBuyState = {
  active?: RecurringBuyRegisteredList,
  methods: RemoteDataType<string, RecurringBuyPeriods[]>,
  period: RecurringBuyPeriods,
  registeredList: RemoteDataType<string, RecurringBuyRegisteredList[]>,
  step: RecurringBuyStepType
}

export enum RecurringBuyStepType {
  'INIT_PAGE',
  'GET_STARTED',
  'FREQUENCY',
  'CHECKOUT_CONFIRM',
  'SUMMARY',
  'FAILURE'
}

export enum RecurringBuyPeriods {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  MONTHLY = 'MONTHLY',
  ONE_TIME = 'ONE_TIME',
}

export type RecurringBuyStepPayload = {
  step: RecurringBuyStepType
}

export enum RecurringBuyItemState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type RecurringBuyRegisteredList = {
  id: string
  userId: string
  inputValue: string
  destinationCurrency: WalletCurrencyType
  paymentMethod: SBPaymentTypes
  paymentMethodId: string | null
  period: RecurringBuyPeriods
  nextPayment: string
  state: RecurringBuyItemState
  insertedAt: string
  updatedAt: string
}
