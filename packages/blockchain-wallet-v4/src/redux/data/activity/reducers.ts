import * as AT from './actionTypes'

import {
  ActivityActionType,
  ActivityStateType,
  CustodialActivityType,
  NonCustodialActivityType,
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
    next: '',
    status: Remote.NotAsked
  }
}

const DEFAULT_NON_CUSTODIAL_ACTIVITY = {
  transactions: {
    items: [],
    next: '',
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
      const failureCustodial: CustodialActivityType = {
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
        [action.payload.product]: failureCustodial
      }
    case AT.FETCH_CUSTODIAL_ACTIVITY_LOADING:
      const loadingCustodial: CustodialActivityType = {
        orders: {
          ...state[action.payload.product].orders,
          status: Remote.Loading
        },
        transactions: {
          ...state[action.payload.product].transactions,
          status: Remote.Loading
        }
      }
      return {
        ...state,
        [action.payload.product]: loadingCustodial
      }
    case AT.FETCH_CUSTODIAL_ACTIVITY_SUCCESS:
      const successCustodial: CustodialActivityType = {
        orders: {
          items: [
            ...action.payload.orders,
            ...state[action.payload.product].orders.items.filter(
              oldItem =>
                !action.payload.orders.find(
                  newItem => newItem.id === oldItem.id
                )
            )
          ],
          status: Remote.Success(SUCCESS_STATUS)
        },
        transactions: {
          ...state[action.payload.product].transactions,
          items: [
            ...action.payload.transactions.items,
            ...state[action.payload.product].transactions.items.filter(
              oldItem =>
                !action.payload.transactions.items.find(
                  newItem => newItem.id === oldItem.id
                )
            )
          ],
          next: action.payload.transactions.next,
          prev: action.payload.transactions.prev,
          status: Remote.Success(SUCCESS_STATUS)
        }
      }

      return {
        ...state,
        [action.payload.product]: successCustodial
      }
    case AT.FETCH_NON_CUSTODIAL_ACTIVITY_FAILURE:
      const failure: NonCustodialActivityType = {
        transactions: {
          ...state.NON_CUSTODIAL[action.payload.coin].transactions,
          status: Remote.Failure(action.payload.error)
        }
      }
      return {
        ...state,
        NON_CUSTODIAL: {
          ...state['NON_CUSTODIAL'],
          [action.payload.coin]: failure
        }
      }
    case AT.FETCH_NON_CUSTODIAL_ACTIVITY_LOADING:
      const loading: NonCustodialActivityType = {
        transactions: {
          ...state.NON_CUSTODIAL[action.payload.coin].transactions,
          status: Remote.Loading
        }
      }
      return {
        ...state,
        NON_CUSTODIAL: {
          ...state['NON_CUSTODIAL'],
          [action.payload.coin]: loading
        }
      }
    case AT.FETCH_NON_CUSTODIAL_ACTIVITY_SUCCESS:
      const success: NonCustodialActivityType = {
        transactions: {
          ...state.NON_CUSTODIAL[action.payload.coin].transactions,
          items: [
            ...action.payload.transactions,
            ...state.NON_CUSTODIAL[
              action.payload.coin
            ].transactions.items.filter(
              oldItem =>
                !action.payload.transactions.find(
                  newItem => newItem.hash === oldItem.hash
                )
            )
          ],
          next: action.payload.next,
          status: Remote.Success(SUCCESS_STATUS)
        }
      }

      return {
        ...state,
        NON_CUSTODIAL: {
          ...state['NON_CUSTODIAL'],
          [action.payload.coin]: success
        }
      }
    default:
      return { ...state }
  }
}
