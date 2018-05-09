import * as AT from './actionTypes'
import { insert } from 'ramda'

const INITIAL_STATE = []

const logger = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  const createLog = (msgType, payload) => {
    return {
      type: msgType,
      file: payload.file,
      method: payload.method,
      message: payload.message,
      timestamp: Date.now()
    }
  }

  switch (type) {
    case AT.LOG_ERROR_MSG: {
      return insert(0, createLog('ERROR', payload), state)
    }
    case AT.LOG_INFO_MSG: {
      return insert(0, createLog('INFO', payload), state)
    }
    default:
      return state
  }
}

export default logger
