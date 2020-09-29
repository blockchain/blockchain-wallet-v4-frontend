import * as AT from './actionTypes'

import { ActivityActionType, ActivityStateType } from './types'

const DEFAULT_CUSTODIAL_ACTIVITY = {
  orders: [],
  transactions: {
    items: [],
    prev: null,
    next: null
  }
}

const DEFAULT_NON_CUSTODIAL_ACTIVITY = {
  transactions: []
}

const INITIAL_STATE: ActivityStateType = {
  SAVINGS: DEFAULT_CUSTODIAL_ACTIVITY,
  SIMPLEBUY: DEFAULT_CUSTODIAL_ACTIVITY,
  SWAP: DEFAULT_CUSTODIAL_ACTIVITY,
  NON_CUSTODIAL: {
    ALGO: DEFAULT_NON_CUSTODIAL_ACTIVITY,
    BCH: DEFAULT_NON_CUSTODIAL_ACTIVITY,
    BTC: DEFAULT_NON_CUSTODIAL_ACTIVITY,
    ETH: DEFAULT_NON_CUSTODIAL_ACTIVITY,
    PAX: DEFAULT_NON_CUSTODIAL_ACTIVITY,
    USDT: DEFAULT_NON_CUSTODIAL_ACTIVITY,
    XLM: DEFAULT_NON_CUSTODIAL_ACTIVITY
  }
}

export const activityReducer = (
  state = INITIAL_STATE,
  action: ActivityActionType
) => {
  switch (action.type) {
    case AT.FETCH_CUSTODIAL_ACTIVITY_FAILURE:
      return {
        ...state,
        [action.payload.product]: {
          ...state[action.payload.product]
        }
      }
    default:
      return { ...state }
  }
}
