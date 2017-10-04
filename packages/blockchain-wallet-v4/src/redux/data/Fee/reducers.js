import * as T from './actionTypes.js'

const INITIAL_STATE = {}

const feeReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case T.FETCH_FEE_SUCCESS: {
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
