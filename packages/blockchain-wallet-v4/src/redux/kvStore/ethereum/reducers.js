import { set, mapped } from 'ramda-lens'
import { compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.UPDATE_METADATA_ETHEREUM: {
      return set(compose(mapped, KVStoreEntry.value), payload, state)
    }
    case AT.FETCH_METADATA_ETHEREUM_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_ETHEREUM:
    case AT.FETCH_METADATA_ETHEREUM_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_ETHEREUM_FAILURE: {
      return Remote.Failure(payload)
    }
    default:
      return state
  }
}
