import { prepend, filter } from 'ramda'
import { ALERTS_CLEAR, ALERTS_SHOW, ALERTS_DISMISS } from './actionTypes'

const INITIAL_STATE = []

export default (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case ALERTS_CLEAR: {
      return []
    }
    case ALERTS_DISMISS: {
      let { id } = action.payload
      return filter(a => a.id !== id, state)
    }
    case ALERTS_SHOW: {
      let { type, message, id } = action.payload
      return prepend({ type, message, id }, state)
    }
    default: {
      return state
    }
  }
}
