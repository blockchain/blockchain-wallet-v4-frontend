import * as T from './actionTypes'

export const fetchLogs = (guid, sharedKey) => ({ type: T.FETCH_LOGS, payload: { guid, sharedKey } })
export const fetchLogsSuccess = (data) => ({ type: T.FETCH_LOGS_SUCCESS, payload: data })
export const fetchLogsError = (data) => ({ type: T.FETCH_LOGS_ERROR, payload: data })
export const deleteLogs = () => ({ type: T.DELETE_LOGS })
