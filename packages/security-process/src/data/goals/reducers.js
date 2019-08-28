import * as AT from './actionTypes'
import { append, assoc, assocPath, filter } from 'ramda'

const INITIAL_STATE = {
  goals: [],
  initialModals: {}
}

const goal = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SAVE_GOAL: {
      return assoc('goals', append(payload, state.goals), state)
    }
    case AT.DELETE_GOAL: {
      const { id } = payload
      return assoc('goals', filter(a => a.id !== id, state.goals), state)
    }
    case AT.ADD_INITIAL_MODAL: {
      return assocPath(['initialModals', payload.key], payload, state)
    }
    default:
      return state
  }
}

export default goal
