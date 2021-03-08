import Remote from '../../remote'
import * as AT from './actionTypes'
import { WalletOptionsState } from './types'

// TODO: once getWalletOptions is working implement default object for failure
const INITIAL_STATE: WalletOptionsState = Remote.NotAsked

export function walletOptionsReducer(state = INITIAL_STATE, action) {
  const { payload, type } = action

  switch (type) {
    case AT.FETCH_OPTIONS_LOADING: {
      return Remote.Loading
    }
    case AT.FETCH_OPTIONS_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_OPTIONS_FAILURE: {
      return Remote.Failure(payload)
    }
    default:
      return state
  }
}
