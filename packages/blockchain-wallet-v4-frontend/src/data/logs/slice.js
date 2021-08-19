import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import LOG_LEVELS from './model'

const initialState = {
  logLevel: LOG_LEVELS.OFF,
  logs: []
}

const createLog = (msgType, payload) => {
  return {
    file: payload.file,
    message: payload.message,
    method: payload.method,
    timestamp: Date.now(),
    type: msgType
  }
}

const logsSlice = createSlice({
  initialState,
  name: 'logs',
  reducers: {
    logErrorMessage: {
      prepare: (file, method, message) => ({ payload: { file, message, method } }),
      reducer: (state, action) => {
        const log = createLog('ERROR', action.payload)
        /* eslint-disable */
        if (state.logLevel === LOG_LEVELS.VERBOSE) console.info('LOG: ', log)
        /* eslint-enable */
        state.logs = [log, ...state.logs]
      }
    },
    logInfoMessage: {
      prepare: (file, method, message) => ({ payload: { file, message, method } }),
      reducer: (state, action) => {
        const log = createLog('INFO', action.payload)
        /* eslint-disable */
        if (state.logLevel === LOG_LEVELS.VERBOSE) console.info('LOG: ', log)
        /* eslint-enable */
        state.logs = [log, ...state.logs]
      }
    },
    setLogLevel: (state, action) => {
      state.logLevel = action.payload
    }
  }
})

export const { logErrorMessage, logInfoMessage, setLogLevel } = logsSlice.actions
const { actions } = logsSlice
const logsReducer = logsSlice.reducer
export { actions, logsReducer }
