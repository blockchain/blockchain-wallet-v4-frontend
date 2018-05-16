import { prepend, filter } from 'ramda'
import { ALERTS_CLEAR, ALERTS_SHOW, ALERTS_DISMISS } from './actionTypes'

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
      const { id, nature, message, data } = action.payload
      return prepend({ id, nature, message, data }, state)
    }
    default: {
      return state
    }
  }
}
