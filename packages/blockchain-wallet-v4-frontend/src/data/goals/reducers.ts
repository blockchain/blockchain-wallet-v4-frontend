import * as AT from './actionTypes'
import { append, assoc, filter } from 'ramda'
import { GoalsState } from './types'

const INITIAL_STATE: GoalsState = {
  goals: [],
  initialModals: {},
  initialModalDisplayed: false
}

export function goalsReducer (state = INITIAL_STATE, action): GoalsState {
  switch (action.type) {
    case AT.SAVE_GOAL: {
      return assoc('goals', append(action.payload, state.goals), state)
    }
    case AT.DELETE_GOAL: {
      const { id } = action.payload
      return assoc('goals', filter(a => a.id !== id, state.goals), state)
    }
    case AT.ADD_INITIAL_MODAL: {
      return {
        ...state,
        initialModals: {
          ...state.initialModals,
          [action.payload.key]: action.payload
        }
      }
    }
    case AT.INITIAL_MODAL_DISPLAYED: {
      return assoc('initialModalDisplayed', true, state)
    }
    default:
      return state
  }
}
