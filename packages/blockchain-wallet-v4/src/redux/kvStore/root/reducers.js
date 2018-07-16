import { set, mapped } from 'ramda-lens'
import { compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes.js'
import Remote from '../../../remote'

const INITIAL_STATE = Remote.NotAsked

export const kvRootReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.UPDATE_METADATA_ROOT: {
      return set(compose(mapped, KVStoreEntry.value), payload, state)
    }
    case AT.FETCH_METADATA_ROOT_LOADING: {
      return Remote.Loading
    }
    case AT.FETCH_METADATA_ROOT_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_ROOT_FAILURE: {
      return Remote.Failure(payload)
    }
    default:
      return state
  }
}

export default kvRootReducer
