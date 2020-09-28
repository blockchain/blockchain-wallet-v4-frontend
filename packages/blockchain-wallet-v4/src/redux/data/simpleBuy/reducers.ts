import * as AT from './actionTypes'
import { SBCoreActionTypes, SBCoreStateType } from './types'

const DEFAULT_COIN_SB_STATE = {
  nextSBTransactionsURL: null,
  pendingTxsN: 0
}

const INITIAL_STATE: SBCoreStateType = {
  BCH: DEFAULT_COIN_SB_STATE,
  BTC: DEFAULT_COIN_SB_STATE,
  ETH: DEFAULT_COIN_SB_STATE,
  ALGO: DEFAULT_COIN_SB_STATE,
  PAX: DEFAULT_COIN_SB_STATE,
  USDT: DEFAULT_COIN_SB_STATE,
  XLM: DEFAULT_COIN_SB_STATE,
  USD: DEFAULT_COIN_SB_STATE,
  GBP: DEFAULT_COIN_SB_STATE,
  EUR: DEFAULT_COIN_SB_STATE
}

export function simpleBuyCoreReducer (
  state = INITIAL_STATE,
  action: SBCoreActionTypes
) {
  switch (action.type) {
    case AT.SET_SB_CORE_COIN_DATA: {
      return {
        ...state,
        [action.payload.coin]: {
          ...state[action.payload.coin],
          nextSBTransactionsURL: action.payload.next,
          pendingTxsN:
            state[action.payload.coin].pendingTxsN + action.payload.pendingTxsN
        }
      }
    }
    default:
      return {
        ...state
      }
  }
}
