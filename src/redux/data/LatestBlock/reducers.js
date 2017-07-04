import * as T from '../../actionTypes.js'
import { path } from 'ramda'

const INITIAL_STATE = {}

const latestBlockReducer = (state = INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case T.common.LATEST_BLOCK_DATA_LOAD: {
      const { payload } = action
      return path(['info', 'latest_block'], payload)
    }
    default:
      return state
  }
}

export default latestBlockReducer
