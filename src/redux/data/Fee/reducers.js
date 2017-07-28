import * as T from './actionTypes.js'

const INITIAL_STATE = {}

const feeReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case T.FETCH_FEE_SUCCESS: {
      let { payload } = action
      return payload
    }
    case T.DELETE_FEE: {
      return {}
    }
    default:
      return state
  }
}

export default feeReducer
