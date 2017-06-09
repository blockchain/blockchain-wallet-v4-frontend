import * as A from './actions.js'

const INITIAL_STATE = []

const txsReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case A.CONTEXT_TXS_LOAD: {
      let { payload } = action
      return payload
    }
    case A.CONTEXT_TXS_CLEAR: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}

export default txsReducer
