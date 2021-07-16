export enum RecurringBuyStepType {
  'INIT_PAGE',
  'GET_STARTED',
  'FREQUENCY',
  'CHECKOUT_CONFIRM',
  'SUMMARY'
}

// state
export type RecurringBuyState = {
  step: RecurringBuyStepType
}

export type RecurringBuyStepPayload = {
  step: RecurringBuyStepType
}
