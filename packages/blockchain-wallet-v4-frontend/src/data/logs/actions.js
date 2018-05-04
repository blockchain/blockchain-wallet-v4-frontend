import * as AT from './actionTypes'

export const logInfoMessage = (location, message) => ({ type: AT.LOG_INFO_MSG, payload: { location, message } })
export const logErrorMessage = (location, message) => ({ type: AT.LOG_ERROR_MSG, payload: { location, message } })
