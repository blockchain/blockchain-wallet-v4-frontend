import { assoc } from 'ramda'
import * as AT from './actionTypes.js'
import Remote from '../../../remote'

const INITIAL_STATE = {
  profile: Remote.NotAsked,
  trades: Remote.NotAsked
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
    case AT.FETCH_QUOTE_LOADING: {
      return assoc('quote', Remote.Loading, state)
    }
    case AT.FETCH_QUOTE_SUCCESS: {
      return assoc('quote', Remote.Success(payload), state)
    }
    case AT.FETCH_QUOTE_FAILURE: {
      return assoc('quote', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default sfoxReducer
