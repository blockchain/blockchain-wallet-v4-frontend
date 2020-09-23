import * as AT from './actionTypes'
import { SBCoreActionTypes, SBCoreStateType } from './types'

const INITIAL_STATE: SBCoreStateType = {
  BCH: {
    nextSBTransactionsURL: null
  },
  BTC: {
    nextSBTransactionsURL: null
  },
  ETH: {
    nextSBTransactionsURL: null
  },
  ALGO: {
    nextSBTransactionsURL: null
  },
  PAX: {
    nextSBTransactionsURL: null
  },
  USDT: {
    nextSBTransactionsURL: null
  },
  XLM: {
    nextSBTransactionsURL: null
  },
  USD: {
    nextSBTransactionsURL: null
  },
  GBP: {
    nextSBTransactionsURL: null
  },
  EUR: {
    nextSBTransactionsURL: null
  }
}

export function simpleBuyCoreReducer (
  state = INITIAL_STATE,
  action: SBCoreActionTypes
) {
  switch (action.type) {
    case AT.SET_NEXT_SB_TRANSACTIONS_URL: {
      return {
        ...state,
        [action.payload.coin]: {
          ...state[action.payload.coin],
          nextSBTransactionsURL: action.payload.next
        }
      }
    }
    default:
      return {
        ...state
      }
  }
}
