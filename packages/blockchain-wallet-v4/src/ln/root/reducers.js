import * as T from './actionTypes'

let INITIAL_STATE = {}

const LNRootReducer = (state = INITIAL_STATE, action) => {
  const { type, options } = action
  switch (type) {
    case T.STORE_OPTIONS: {
      let copy = Object.assign({}, state)
      copy['options'] = options
      return copy
    }
    default: return state
  }
}

export default LNRootReducer