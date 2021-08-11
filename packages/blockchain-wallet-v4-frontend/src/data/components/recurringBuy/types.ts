import { RecurringBuyPeriods } from 'blockchain-info-components/src/Flyouts/types'
import { RemoteDataType, SBPaymentTypes, WalletCurrencyType } from 'core/types'

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
  'FAILURE'
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

export { RecurringBuyPeriods }
