import * as AT from './actionTypes'
import { insert, path, contains } from 'ramda'
import assert from 'assert'
import { TRACKING_ACTIONS } from './model'

const INITIAL_STATE = []

const analytics = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.LOG_EVENT: {
      assert(path(['trackingData', 'length'], payload), 'trackingData cannot be empty')
      const trackingAction = path(['trackingData', 1], payload)
      assert(contains(trackingAction, TRACKING_ACTIONS), `tracking action: ${trackingAction} is not recognized`)

      return insert(0, payload, state)
    }
    default:
      return state
  }
}

export default analytics
