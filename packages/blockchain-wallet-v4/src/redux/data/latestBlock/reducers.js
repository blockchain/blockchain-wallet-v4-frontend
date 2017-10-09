import * as T from '../../actionTypes.js'
import { path } from 'ramda'

const INITIAL_STATE = {}

const latestBlockReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case T.common.SET_BLOCKCHAIN_DATA: {
      return path(['info', 'latest_block'], payload)
    }
    case T.latestBlock.SET_LATEST_BLOCK: {
      const { latestBlock } = payload
      return latestBlock
    }
    default:
      return state
  }
}

export default latestBlockReducer
