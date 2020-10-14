import * as AT from './actionTypes'
import { __, assocPath, compose, merge } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { mapped, over, set } from 'ramda-lens'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.FETCH_METADATA_WALLET_CREDENTIALS_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_WALLET_CREDENTIALS:
    case AT.FETCH_METADATA_WALLET_CREDENTIALS_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_WALLET_CREDENTIALS_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.SET_WALLET_CREDENTIALS: {
      const { guid, sharedKey, password } = payload
      return over(
        compose(mapped, KVStoreEntry.value),
        merge(__, { guid, sharedKey, password }),
        state
      )
    }
    default:
      return state
  }
}
