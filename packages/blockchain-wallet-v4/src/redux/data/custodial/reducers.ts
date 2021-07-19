import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { SBCoreActionTypes, SBCoreStateType } from './types'

const INITIAL_STATE: SBCoreStateType = {
  coins: {}
}

/* eslint-disable import/prefer-default-export */
export function custodialReducer(state = INITIAL_STATE, action: SBCoreActionTypes) {
  switch (action.type) {
    case AT.SET_SB_CORE_COIN_DATA: {
      return {
        ...state,
        coins: {
          ...state.coins,
          [action.payload.coin]: {
            ...state.coins[action.payload.coin],
            nextSBTransactionsURL: action.payload.next,
            pendingTxsN: action.payload.pendingTxsN
          }
        }
      }
    }
    default:
      return {
        ...state
      }
  }
}

export default custodialReducer
