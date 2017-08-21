import * as T from './actionTypes.js'

const INITIAL_STATE = []

const advertsReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case T.FETCH_ADVERTS_SUCCESS: {
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

export default advertsReducer
