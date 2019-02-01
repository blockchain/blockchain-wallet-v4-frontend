import * as AT from './actionTypes'
import { insert, path, assoc } from 'ramda'

export const INITIAL_STATE = {
  swapTiming: null,
  events: []
}

const analytics = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.LOG_EVENT: {
      // [category, action, name]
      const pathIsValid = path(['trackingData', 'length'], payload) > 0
      if (pathIsValid) {
        const newEvents = insert(0, payload, state.events)
        return assoc('events', newEvents, state)
      }
      return state
    }
    default:
      return state
  }
}

export default analytics
