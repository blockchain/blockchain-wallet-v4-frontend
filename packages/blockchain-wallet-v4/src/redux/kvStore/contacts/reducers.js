// import { set } from 'ramda-lens'
// import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_METADATA_CONTACTS_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_CONTACTS:
    case AT.FETCH_METADATA_CONTACTS_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_CONTACTS_FAILURE: {
      return Remote.Failure(payload)
    }
    default:
      return state
  }
}
