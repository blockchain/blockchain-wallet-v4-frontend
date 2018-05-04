import * as AT from './actionTypes'
import { insert } from 'ramda'

const INITIAL_STATE = []

const logger = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.LOG_INFO_MSG: {
      return insert(0, payload, state)
    }
    default:
      return state
  }
}

export default logger
