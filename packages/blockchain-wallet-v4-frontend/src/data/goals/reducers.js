import * as AT from './actionTypes'
import { append, assoc, assocPath, filter } from 'ramda'

const INITIAL_STATE = {
  goals: [],
  initialModals: {},
  initialModalDisplayed: false
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
    case AT.INITIAL_MODAL_DISPLAYED: {
      return assoc('initialModalDisplayed', true, state)
    }
    default:
      return state
  }
}

export default goal
