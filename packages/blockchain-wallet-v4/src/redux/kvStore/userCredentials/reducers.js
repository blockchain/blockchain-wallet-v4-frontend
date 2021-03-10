import { __, compose, merge } from 'ramda'
import { mapped, over } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.FETCH_METADATA_USER_CREDENTIALS_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_USER_CREDENTIALS:
    case AT.FETCH_METADATA_USER_CREDENTIALS_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_USER_CREDENTIALS_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.SET_USER_CREDENTIALS: {
      const { lifetime_token, user_id } = payload
      return over(
        compose(mapped, KVStoreEntry.value),
        merge(__, { user_id, lifetime_token }),
        state
      )
    }
    default:
      return state
  }
}
