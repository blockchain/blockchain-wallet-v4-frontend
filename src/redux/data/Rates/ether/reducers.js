import * as T from './actionTypes.js'

const INITIAL_STATE = {}

const ethRatesReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case T.FETCH_ETH_RATES_SUCCESS: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}

export default ethRatesReducer
