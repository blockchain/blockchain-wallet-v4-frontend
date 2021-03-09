import { __, compose, mergeRight } from 'ramda'
import { mapped, over } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action
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
      const { guid, password, sharedKey } = payload
      return over(
        compose(mapped, KVStoreEntry.value),
        mergeRight(__, { guid, sharedKey, password }),
        state
      )
    }
    default:
      return state
  }
}
