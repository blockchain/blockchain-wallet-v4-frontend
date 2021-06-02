import { prepend } from 'ramda'

import { ALERTS_CLEAR, ALERTS_DISMISS, ALERTS_SHOW } from './actionTypes'
import { AlertsState } from './types'

const INITIAL_STATE: AlertsState = []

export function alertsReducer(state = INITIAL_STATE, action) {
  const { payload, type } = action

  switch (type) {
    case ALERTS_CLEAR: {
      return []
    }
    case ALERTS_DISMISS: {
      const { id } = payload
      return state.filter((alert) => alert.id !== id)
    }
    case ALERTS_SHOW: {
      return prepend({ ...action.payload }, state)
    }
    default: {
      return state
    }
  }
}

export default alertsReducer
