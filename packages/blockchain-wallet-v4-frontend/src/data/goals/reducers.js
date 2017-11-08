import * as AT from './actionTypes'
import { insert, filter } from 'ramda'

const INITIAL_STATE = []

const goal = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SAVE_GOAL: {
      return insert(0, payload, state)
    }
    case AT.DELETE_GOAL: {
      const { id } = payload
      return filter(a => a.id !== id, state)
    }
    default:
      return state
  }
}

export default goal
