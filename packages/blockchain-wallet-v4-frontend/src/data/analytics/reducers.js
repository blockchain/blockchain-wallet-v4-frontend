import * as AT from './actionTypes'
import { insert, path, assoc } from 'ramda'
import { SHOW_CONFIRMATION } from '../components/exchange/actionTypes'
import moment from 'moment'

export const INITIAL_STATE = {
  swapTiming: null,
  events: []
}

const analytics = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.LOG_EVENT: {
      const pathIsValid = path(['trackingData', 'length'], payload) > 0
      if (pathIsValid) {
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
