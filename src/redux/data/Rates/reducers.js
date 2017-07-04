import * as T from './actionTypes.js'

const INITIAL_STATE = {}

const ratesReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case T.FETCH_RATES_SUCCESS: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}

export default ratesReducer
