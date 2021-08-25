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
  paymentInfo: RemoteDataType<string, RecurringBuyNextPayment[]>
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

export type RecurringBuyNextPayment = {
  eligibleMethods: SBPaymentTypes[]
  nextPayment: string
  period: RecurringBuyPeriods
}
/* eslint-disable */
export enum RecurringBuyPeriods {
  ONE_TIME = 'ONE_TIME',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  MONTHLY = 'MONTHLY'
}
/* eslint-enable */

export enum RecurringBuyFailureReasons {
  FAILED_BAD_FILL = 'FAILED_BAD_FILL',
  FAILED_BENEFICIARY_BLOCKED = 'FAILED_BENEFICIARY_BLOCKED',
  FAILED_INSUFFICIENT_FUNDS = 'FAILED_INSUFFICIENT_FUNDS'
}
