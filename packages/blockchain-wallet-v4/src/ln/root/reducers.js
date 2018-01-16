import * as T from './actionTypes'

let INITIAL_STATE = {}

const LNRootReducer = (state = INITIAL_STATE, action) => {
  const { type, key } = action
  switch (type) {
    case T.ADD_PRIVATE_KEY: {
      let copy = Object.assign({}, state)
      copy['private_key'] = key
      return copy
    }
    default: return state
  }
}

export default LNRootReducer