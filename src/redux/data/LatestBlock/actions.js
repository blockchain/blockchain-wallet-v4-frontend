export const LATEST_BLOCK_DATA_LOAD = '@v3.LATEST_BLOCK_DATA_LOAD'

export const loadLatestBlockData = (data) =>
  ({ type: LATEST_BLOCK_DATA_LOAD, payload: data })
