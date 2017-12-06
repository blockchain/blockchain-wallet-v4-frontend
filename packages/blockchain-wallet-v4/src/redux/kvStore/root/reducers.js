import { set } from 'ramda-lens'
import { KVStoreEntry } from '../../../types'
import * as T from './actionTypes.js'

const INITIAL_STATE = {}

export const kvRootReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.SET_ROOT: {
      return payload
    }
    case T.UPDATE_ROOT: {
      return set(KVStoreEntry.value, payload, state)
    }
    default:
      return state
  }
}

export default kvRootReducer
