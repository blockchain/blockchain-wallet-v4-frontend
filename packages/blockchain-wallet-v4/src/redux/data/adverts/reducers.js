import * as T from './actionTypes.js'

const INITIAL_STATE = []

const advertsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case T.SET_ADVERTS: {
      return payload
    }
    default:
      return state
  }
}

export default advertsReducer
