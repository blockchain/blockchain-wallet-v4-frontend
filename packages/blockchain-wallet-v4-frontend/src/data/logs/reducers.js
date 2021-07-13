import { assoc, insert } from 'ramda'

import * as AT from './actionTypes'
import LOG_LEVELS from './model'

const INITIAL_STATE = {
  logLevel: LOG_LEVELS.OFF,
  logs: []
}

const logger = (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  const createLog = (msgType, payload) => {
    return {
      file: payload.file,
      message: payload.message,
      method: payload.method,
      timestamp: Date.now(),
      type: msgType
    }
  }

  const { logLevel, logs } = state

  switch (type) {
    case AT.LOG_ERROR_MSG: {
      const log = createLog('ERROR', payload)
      /* eslint-disable */
      if (logLevel === LOG_LEVELS.VERBOSE) console.info('LOG: ', log)
      /* eslint-enable */
      return assoc('logs', insert(0, log, logs), state)
    }
    case AT.LOG_INFO_MSG: {
      const log = createLog('INFO', payload)
      /* eslint-disable */
      if (logLevel === LOG_LEVELS.VERBOSE) console.info('LOG: ', log)
      /* eslint-enable */
      return assoc('logs', insert(0, log, logs), state)
    }
    case AT.SET_LOG_LEVEL: {
      return assoc('logLevel', payload.level, state)
    }
    default:
      return state
  }
}

export default logger
