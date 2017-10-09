import * as T from './actionTypes.js'

const INITIAL_STATE = []

const logReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case T.SET_LOGS: {
      return payload
    }
    case T.DELETE_LOGS: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}

export default logReducer
