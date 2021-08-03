import { append, compose, lensProp } from 'ramda'
import { mapped, over } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'

const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    // CREATE
    case AT.CREATE_METADATA_LOCKBOX: {
      return Remote.Success(payload)
    }
    // FETCH
    case AT.FETCH_METADATA_LOCKBOX_LOADING: {
      return Remote.Loading
    }
    case AT.FETCH_METADATA_LOCKBOX_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_LOCKBOX_FAILURE: {
      return Remote.Failure(payload)
    }
    default:
      return state
  }
}
