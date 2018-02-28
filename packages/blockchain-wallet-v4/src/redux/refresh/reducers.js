import { set, mapped } from 'ramda-lens'
import { compose } from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../remote'

const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  console.log(type, payload)

  switch (type) {
    case AT.REFRESH_LOADING: {
      return Remote.Loading
    }
    case AT.REFRESH_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.REFRESH_FAILURE: {
      return Remote.Failure(payload)
    }
    default:
      return state
  }
}
