
import * as AT from './actionTypes'
import { merge } from 'ramda'

const INITIAL_STATE = {}

const session = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SAVE_SESSION: {
      return merge(state, payload)
    }
    default:
      return state
  }
}

export default session
