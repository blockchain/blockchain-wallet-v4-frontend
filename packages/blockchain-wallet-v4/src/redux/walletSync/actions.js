import * as T from './actionTypes'

export const sync = () => ({ type: T.SYNC })
export const forceSync = () => ({ type: T.FORCE_SYNC })
export const syncSuccess = (checksum) => ({
  payload: checksum,
  type: T.SYNC_SUCCESS
})
export const syncError = (error) => ({
  error: true,
  payload: error,
  type: T.SYNC_ERROR
})
