import * as AT from './actionTypes'

import {
  ActivityActionType,
  ActivityStateType,
  CustodialActivityType
} from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

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
): ActivityStateType => {
  switch (action.type) {
    case AT.FETCH_CUSTODIAL_ACTIVITY_FAILURE:
      return {
        ...state,
        [action.payload.product]: {
          orders: [
            Remote.Failure(action.payload.error),
            ...state[action.payload.product].orders
          ],
          transactions: {
            ...state[action.payload.product].transactions,
            items: [
              Remote.Failure(action.payload.error),
              ...state[action.payload.product].transactions.items
            ]
          }
        } as CustodialActivityType
      }
    case AT.FETCH_CUSTODIAL_ACTIVITY_LOADING:
      return {
        ...state,
        [action.payload.product]: {
          orders: [Remote.Loading, ...state[action.payload.product].orders],
          transactions: {
            ...state[action.payload.product].transactions,
            items: [
              Remote.Loading,
              ...state[action.payload.product].transactions.items
            ]
          }
        } as CustodialActivityType
      }
    case AT.FETCH_CUSTODIAL_ACTIVITY_SUCCESS:
      return {
        ...state,
        [action.payload.product]: {
          orders: [
            Remote.Success(action.payload.orders),
            ...state[action.payload.product].orders
          ],
          transactions: {
            ...state[action.payload.product].transactions,
            items: [
              Remote.Success(action.payload.transactions.items),
              ...state[action.payload.product].transactions.items
            ],
            next: action.payload.transactions.next,
            prev: action.payload.transactions.prev
          }
        } as CustodialActivityType
      }
    default:
      return { ...state }
  }
}
