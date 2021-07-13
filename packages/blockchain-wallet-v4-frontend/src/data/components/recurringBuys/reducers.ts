import * as AT from './actionTypes'
import { RecurringBuysActionTypes, RecurringBuysState, RecurringBuysStepType } from './types'

const INITIAL_STATE: RecurringBuysState = {
  step: RecurringBuysStepType.INIT_PAGE
}

const recurringBuysReducer = (
  state = INITIAL_STATE,
  action: RecurringBuysActionTypes
): RecurringBuysState => {
  switch (action.type) {
    case AT.SET_STEP: {
      return {
        ...state,
        step: action.payload.step
      }
    }
    default:
      return state
  }
}

export default recurringBuysReducer
