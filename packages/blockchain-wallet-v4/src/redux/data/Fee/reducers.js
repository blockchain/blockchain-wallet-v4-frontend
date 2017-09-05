import * as T from './actionTypes.js'

const INITIAL_STATE = {}

const feeReducer = (state = INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case T.FETCH_FEE_SUCCESS: {
      const { payload } = action
      return payload
    }
    case T.DELETE_FEE: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}

export default feeReducer
