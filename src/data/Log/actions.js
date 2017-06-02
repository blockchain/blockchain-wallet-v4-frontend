import { RECORD_LOG } from 'data/actionTypes'

export const recordLog = (log) => ({ type: RECORD_LOG, payload: log })
