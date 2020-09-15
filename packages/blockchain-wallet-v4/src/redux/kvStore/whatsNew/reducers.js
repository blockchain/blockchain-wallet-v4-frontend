import * as AT from './actionTypes'
import { compose, lensProp } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { mapped, set } from 'ramda-lens'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_METADATA_WHATSNEW_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_WHATSNEW:
    case AT.FETCH_METADATA_WHATSNEW_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_WHATSNEW_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.UPDATE_METADATA_WHATSNEW: {
      const { lastViewed } = payload
      return set(
        compose(mapped, KVStoreEntry.value, lensProp('lastViewed')),
        lastViewed,
        state
      )
    }
    default:
      return state
  }
}
