import * as AT from './actionTypes'
import { insert } from 'ramda'

const INITIAL_STATE = []

const goal = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SAVE_GOAL: {
      return insert(0, payload, state)
    }
    default:
      return state
  }
}

export default goal
