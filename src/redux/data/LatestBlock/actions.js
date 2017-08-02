import * as T from './actionTypes'

export const setLatestBlock = (block_index, hash, height, time) =>
  ({ type: T.SET_LATEST_BLOCK, payload: {block_index, hash, height, time} })
