import * as AT from './actionTypes'
import { insert, path, contains, assoc, hasPath } from 'ramda'
import { TRACKING_ACTIONS } from './model'
import { SHOW_CONFIRMATION } from '../components/exchange/actionTypes'
import moment from 'moment'

const INITIAL_STATE = {
  swapTiming: null,
  events: []
}

const analytics = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.LOG_EVENT: {
      const pathIsValid = hasPath(['trackingData', 'length'], payload)
      const actionIsValid = contains(
        path(['trackingData', 1], payload),
        TRACKING_ACTIONS
      )
      if (pathIsValid && actionIsValid) {
        const newEvents = insert(0, payload, state.events)
        return assoc('events', newEvents, state)
      }
      return state
    }
    case AT.SET_SWAP_START_TIME: {
      return assoc('swapTiming', payload, state)
    }
    case SHOW_CONFIRMATION: {
      if (!state.swapTiming) return state
      const timeDiff = moment().diff(moment(state.swapTiming), 'seconds')
      const swapTimeEvent = ['/swap', 'timing', 'swap_completion', timeDiff]
      const newEvents = insert(0, { trackingData: swapTimeEvent }, state.events)

      return assoc('events', newEvents, state)
    }
    default:
      return state
  }
}

export default analytics
