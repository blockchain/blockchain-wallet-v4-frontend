import * as T from './actionTypes.js'

const INITIAL_STATE = {}

const infoReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case T.INFO_DATA_LOAD: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}

export default infoReducer
