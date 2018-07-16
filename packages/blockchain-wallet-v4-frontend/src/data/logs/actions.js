import * as AT from './actionTypes'

export const logInfoMessage = (file, method, message) => ({ type: AT.LOG_INFO_MSG, payload: { file, method, message } })
export const logErrorMessage = (file, method, message) => ({ type: AT.LOG_ERROR_MSG, payload: { file, method, message } })
