import { compose } from 'ramda'
import { mapped, set } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes.js'

const INITIAL_STATE = Remote.NotAsked

export const kvRootReducer = (state = INITIAL_STATE, action) => {
  const { payload, type } = action
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
