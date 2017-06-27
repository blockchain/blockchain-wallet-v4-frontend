import * as T from './actionTypes.js'

const INITIAL_STATE = {}

const latestBlockReducer = (state = INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case T.LATEST_BLOCK_DATA_LOAD: {
      const { payload } = action
      return payload
    }
    default:
      return state
  }
}

export default latestBlockReducer
