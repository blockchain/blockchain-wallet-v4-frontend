import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'
import { TransferEthState } from './types'

const INITIAL_STATE: TransferEthState = {
  payment: Remote.NotAsked
}

export function transferEthReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AT.TRANSFER_ETH_INITIALIZED:
      return {
        payment: Remote.NotAsked
      }
    case AT.TRANSFER_ETH_PAYMENT_UPDATED_LOADING: {
      return {
        ...state,
        payment: Remote.Loading
      }
    }
    case AT.TRANSFER_ETH_PAYMENT_UPDATED_SUCCESS: {
      return {
        ...state,
        payment: Remote.Success(action.payload)
      }
    }
    case AT.TRANSFER_ETH_PAYMENT_UPDATED_FAILURE: {
      return {
        ...state,
        payment: Remote.Failure(action.payload)
      }
    }
    default:
      return state
  }
}
