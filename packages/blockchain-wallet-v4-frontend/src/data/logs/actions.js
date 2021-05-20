import * as AT from './actionTypes'

export const logInfoMessage = (file, method, message) => ({
  payload: { file, message, method },
  type: AT.LOG_INFO_MSG
})
export const logErrorMessage = (file, method, message) => ({
  payload: { file, message, method },
  type: AT.LOG_ERROR_MSG
})
export const setLogLevel = (level) => ({
  payload: { level },
  type: AT.SET_LOG_LEVEL
})
