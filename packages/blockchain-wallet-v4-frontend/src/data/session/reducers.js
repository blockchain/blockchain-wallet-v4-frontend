
import * as AT from './actionTypes'
import { merge, dissoc } from 'ramda'

const INITIAL_STATE = {}

const session = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SAVE_SESSION: {
      return merge(state, payload)
    }
    case AT.REMOVE_SESSION: {
      return dissoc(payload, state)
    }
    default:
      return state
  }
}

export default session
