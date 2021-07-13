import * as AT from './actionTypes'

export enum RecurringBuysStepType {
  'INIT_PAGE'
}

// state
export type RecurringBuysState = {
  step: RecurringBuysStepType
}

// actions
interface SetRecurringBuysStepActionType {
  payload: RecurringBuysPayload
  type: typeof AT.SET_STEP
}

export type RecurringBuysPayload = {
  options?: never
  step: RecurringBuysStepType
}

export type RecurringBuysActionTypes = SetRecurringBuysStepActionType
