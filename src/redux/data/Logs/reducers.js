import * as T from './actionTypes.js'

const INITIAL_STATE = []

const logReducer = (state = INITIAL_STATE, action) => {
  const { type } = action

  switch (type) {
    case T.FETCH_LOGS_SUCCESS: {
      console.log(action)
      const { payload } = action
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
