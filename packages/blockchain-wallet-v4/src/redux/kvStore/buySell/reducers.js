// import { set } from 'ramda-lens'
// import { KVStoreEntry } from '../../../types'
import * as T from './actionTypes.js'

// initial state should be a kvstore object
const INITIAL_STATE = {}

export const buySellReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.SET_BUYSELL: {
      const { data } = payload
      return data
    }
    default:
      return state
  }
}

export default buySellReducer
