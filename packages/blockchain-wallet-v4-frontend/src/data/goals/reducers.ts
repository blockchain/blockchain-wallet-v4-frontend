import { append, assoc, filter } from 'ramda'

import * as AT from './actionTypes'
import { GoalsState } from './types'

const INITIAL_STATE: GoalsState = {
  goals: [],
  initialModalDisplayed: false,
  initialModals: {},
  initialRedirect: ''
}

const goalsReducer = (state = INITIAL_STATE, action): GoalsState => {
  switch (action.type) {
    case AT.SAVE_GOAL: {
      return assoc('goals', append(action.payload, state.goals), state)
    }
    case AT.DELETE_GOAL: {
      const { id } = action.payload
      return assoc(
        'goals',
        filter((a) => a.id !== id, state.goals),
        state
      )
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
    case AT.ADD_INITIAL_REDIRECT: {
      return {
        ...state,
        initialRedirect: action.payload.path
      }
    }
    case AT.INITIAL_MODAL_DISPLAYED: {
      return {
        ...state,
        initialModalDisplayed: true
      }
    }
    default:
      return state
  }
}

export default goalsReducer
