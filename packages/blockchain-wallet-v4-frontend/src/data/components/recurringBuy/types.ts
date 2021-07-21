import { RemoteDataType } from "core/types"

export enum RecurringBuyStepType {
  'INIT_PAGE',
  'GET_STARTED',
  'FREQUENCY',
  'CHECKOUT_CONFIRM',
  'SUMMARY'
}

export enum RecurringBuyPeriods {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  MONTHLY = 'MONTHLY',
  ONE_TIME = 'ONE_TIME',
}

// state
export type RecurringBuyState = {
  step: RecurringBuyStepType,
  methods: RemoteDataType<string, RecurringBuyPeriods[]>,
  period: RecurringBuyPeriods
}

export type RecurringBuyStepPayload = {
  step: RecurringBuyStepType
}
