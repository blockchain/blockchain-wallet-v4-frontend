import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { FundRecoveryActionType, FundRecoveryStateType } from './types'

const INITIAL_STATE: FundRecoveryStateType = {}

export function fundRecoveryReducer(
  state = INITIAL_STATE,
  action: FundRecoveryActionType
): FundRecoveryStateType {
  switch (action.type) {
    case AT.SEARCH_CHAIN_FOR_FUNDS_FAILURE:
      return {
        ...state,
        [action.payload.coin]: Remote.Failure(action.payload.error)
      }
    case AT.SEARCH_CHAIN_FOR_FUNDS_LOADING:
      return {
        ...state,
        [action.payload.coin]: Remote.Loading
      }
    case AT.SEARCH_CHAIN_FOR_FUNDS_SUCCESS:
      return {
        ...state,
        [action.payload.coin]: Remote.Success(action.payload)
      }
    default:
      return state
  }
}

export default fundRecoveryReducer
