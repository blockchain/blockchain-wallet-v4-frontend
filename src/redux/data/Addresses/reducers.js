import * as A from './actions.js'

const INITIAL_STATE = []

const addressesReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case A.ADDRESSES_DATA_LOAD: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}

export default addressesReducer
