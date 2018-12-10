import Remote from '../../remote'
import * as AT from './actionTypes'

// TODO: once getWalletOptions is working implement default object for failure
const INITIAL_STATE = Remote.NotAsked

const walletOptionsReducer = (state = INITIAL_STATE, action) => {
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

export default walletOptionsReducer
