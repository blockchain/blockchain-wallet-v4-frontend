import { ALERTS_CLEAR, ALERTS_DISMISS, ALERTS_SHOW } from './actionTypes'
import { filter, prepend } from 'ramda'

const INITIAL_STATE = []

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case ALERTS_CLEAR: {
      return INITIAL_STATE
    }
    case ALERTS_DISMISS: {
      const { id } = payload
      return filter(a => a.id !== id, state)
    }
    case ALERTS_SHOW: {
      return prepend({ ...action.payload }, state)
    }
    default: {
      return state
    }
  }
}
