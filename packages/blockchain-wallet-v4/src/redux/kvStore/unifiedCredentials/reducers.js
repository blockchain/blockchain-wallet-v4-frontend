import { __, anyPass, compose, isEmpty, isNil, merge, reject } from 'ramda'
import { mapped, over } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.FETCH_METADATA_UNIFIED_CREDENTIALS_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_UNIFIED_CREDENTIALS:
    case AT.FETCH_METADATA_UNIFIED_CREDENTIALS_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_UNIFIED_CREDENTIALS_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.SET_UNIFIED_CREDENTIALS: {
      // remove empty/undefined props from update to allow property level updates
      const newKV = reject(anyPass([isEmpty, isNil]))(payload)
      return over(compose(mapped, KVStoreEntry.value), merge(__, newKV), state)
    }
    default:
      return state
  }
}
