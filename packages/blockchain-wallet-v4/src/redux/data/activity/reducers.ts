import * as AT from './actionTypes'

import {
  ActivityActionType,
  ActivityStateType,
  CustodialActivityType,
  SUCCESS_STATUS
} from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const DEFAULT_CUSTODIAL_ACTIVITY = {
  orders: {
    items: [],
    status: Remote.NotAsked
  },
  transactions: {
    items: [],
    prev: null,
    next: null,
    status: Remote.NotAsked
  }
}

const DEFAULT_NON_CUSTODIAL_ACTIVITY = {
  transactions: {
    items: [],
    status: Remote.NotAsked
  }
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
): ActivityStateType => {
  switch (action.type) {
    case AT.FETCH_CUSTODIAL_ACTIVITY_FAILURE:
      const failure: CustodialActivityType = {
        orders: {
          ...state[action.payload.product].orders,
          status: Remote.Failure(action.payload.error)
        },
        transactions: {
          ...state[action.payload.product].transactions,
          status: Remote.Failure(action.payload.error)
        }
      }
      return {
        ...state,
        [action.payload.product]: failure as CustodialActivityType
      }
    // ❓
    // Open question for discussion: do we even have a loading state?
    // is the entire tx list in a loading state if one activity feed is loading?
    // => no.
    // is there a loading indicator somewhere if one activity feed is loading?
    // => maybe?
    // should we keep this on a separate field?
    // => maybe `status`?
    // ❓
    // case AT.FETCH_CUSTODIAL_ACTIVITY_LOADING:
    //   return {
    //     ...state,
    //     [action.payload.product]: {
    //       orders: [Remote.Loading, ...state[action.payload.product].orders],
    //       transactions: {
    //         ...state[action.payload.product].transactions,
    //         items: [
    //           Remote.Loading,
    //           ...state[action.payload.product].transactions.items
    //         ]
    //       }
    //     } as CustodialActivityType
    //   }
    case AT.FETCH_CUSTODIAL_ACTIVITY_SUCCESS:
      const success: CustodialActivityType = {
        orders: {
          items: [
            ...action.payload.orders,
            ...state[action.payload.product].orders.items
          ],
          status: Remote.Success(SUCCESS_STATUS)
        },
        transactions: {
          ...state[action.payload.product].transactions,
          items: [
            ...action.payload.transactions.items,
            ...state[action.payload.product].transactions.items
          ],
          next: action.payload.transactions.next,
          prev: action.payload.transactions.prev,
          status: Remote.Success(SUCCESS_STATUS)
        }
      }

      return {
        ...state,
        [action.payload.product]: success
      }
    default:
      return { ...state }
  }
}
