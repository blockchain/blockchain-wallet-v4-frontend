import * as T from './actionTypes'

export const sync = () => ({ type: T.SYNC })
export const forceSync = () => ({ type: T.FORCE_SYNC })
export const syncSuccess = checksum => ({
  type: T.SYNC_SUCCESS,
  payload: checksum
})
export const syncError = error => ({
  type: T.SYNC_ERROR,
  payload: error,
  error: true
})
