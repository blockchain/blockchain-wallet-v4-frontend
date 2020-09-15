import * as AT from './actionTypes'
import { WalletOptionsState } from './types'
import Remote from '../../remote'

// TODO: once getWalletOptions is working implement default object for failure
const INITIAL_STATE: WalletOptionsState = Remote.NotAsked

export function walletOptionsReducer (state = INITIAL_STATE, action) {
  const { type, payload } = action

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
