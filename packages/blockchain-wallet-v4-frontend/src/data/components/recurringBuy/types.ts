import type { BSPaymentTypes, FiatType, RemoteDataType, WalletCurrencyType } from '@core/types'
import type { ModalOriginType, RecurringBuyOrigins } from 'data/modals/types'

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
  CHECKOUT_CONFIRM = 'CHECKOUT_CONFIRM',
  DETAILS = 'DETAILS',
  FAILURE = 'FAILURE',
  FREQUENCY = 'FREQUENCY',
  GET_STARTED = 'GET_STARTED',
  INIT_PAGE = 'INIT_PAGE',
  REMOVE_CONFIRM = 'REMOVE_CONFIRM',
  SUMMARY = 'SUMMARY'
}

export type RecurringBuyStepPayload = {
  origin?: ModalOriginType
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
  paymentMethod: BSPaymentTypes
  paymentMethodId: string | null
  period: RecurringBuyPeriods
  state: RecurringBuyItemState
  updatedAt: string
  userId: string
}

export type RecurringBuyNextPayment = {
  eligibleMethods: BSPaymentTypes[]
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

export type SetPeriodPayload = {
  origin: RecurringBuyOrigins
  period: RecurringBuyPeriods
}
