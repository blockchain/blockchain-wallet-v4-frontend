import * as T from './actionTypes.js'
import { indexBy, prop } from 'ramda'

const INITIAL_STATE = []

const addressesReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case T.ADDRESSES_DATA_LOAD: {
      const { payload } = action
      return indexBy(prop('address'), payload)
    }
    default:
      return state
  }
}

export default addressesReducer
