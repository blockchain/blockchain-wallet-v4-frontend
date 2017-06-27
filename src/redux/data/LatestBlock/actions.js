import * as T from './actionTypes.js'

export const loadLatestBlockData = (data) =>
  ({ type: T.LATEST_BLOCK_DATA_LOAD, payload: data })
