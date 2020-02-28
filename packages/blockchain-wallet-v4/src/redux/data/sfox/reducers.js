import * as AT from './actionTypes.js'
import { assoc } from 'ramda'
import Remote from '../../../remote'

const INITIAL_STATE = {
  trade: null,
  quote: Remote.NotAsked,
  trades: Remote.NotAsked,
  profile: Remote.NotAsked,
  achAccounts: Remote.NotAsked,
  nextAddress: null
}

const sfoxReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_PROFILE_LOADING: {
      return assoc('profile', Remote.Loading, state)
    }
    case AT.FETCH_PROFILE_SUCCESS: {
      return assoc('profile', Remote.Success(payload), state)
    }
    case AT.FETCH_PROFILE_FAILURE: {
      return assoc('profile', Remote.Failure(payload), state)
    }

    case AT.FETCH_TRADES_LOADING: {
      return assoc('trades', Remote.Loading, state)
    }
    case AT.FETCH_TRADES_SUCCESS: {
      return assoc('trades', Remote.Success(payload), state)
    }
    case AT.FETCH_TRADES_FAILURE: {
      return assoc('trades', Remote.Failure(payload), state)
    }
    case AT.FETCH_SFOX_ACCOUNTS_LOADING: {
      return assoc('achAccounts', Remote.Loading, state)
    }
    case AT.FETCH_SFOX_ACCOUNTS_SUCCESS: {
      return assoc('achAccounts', Remote.Success(payload), state)
    }
    default:
      return state
  }
}

export default sfoxReducer
