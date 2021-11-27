import * as AT from './actionTypes'
import { BSCoreActionTypes, BSCoreStateType } from './types'

const INITIAL_STATE: BSCoreStateType = {
  coins: {}
}

/* eslint-disable import/prefer-default-export */
export function custodialReducer(state = INITIAL_STATE, action: BSCoreActionTypes) {
  switch (action.type) {
    case AT.SET_BS_CORE_COIN_DATA: {
      return {
        ...state,
        coins: {
          ...state.coins,
          [action.payload.coin]: {
            ...state.coins[action.payload.coin],
            nextBSTransactionsURL: action.payload.next,
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
