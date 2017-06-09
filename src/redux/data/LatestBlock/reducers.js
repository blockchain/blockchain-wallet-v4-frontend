import * as A from './actions.js'

const INITIAL_STATE = {}

const latestBlockReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case A.LATEST_BLOCK_DATA_LOAD: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}

export default latestBlockReducer
