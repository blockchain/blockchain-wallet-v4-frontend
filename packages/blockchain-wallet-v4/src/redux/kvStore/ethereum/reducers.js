// import { set } from 'ramda-lens'
// import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import * as RD from '../../remoteData'

// initial state should be a kvstore object
const INITIAL_STATE = RD.NotAsked()

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_METADATA_ETHEREUM_LOADING: {
      return RD.Loading()
    }
    case AT.FETCH_METADATA_ETHEREUM_SUCCESS: {
      return RD.Success(payload)
    }
    case AT.FETCH_METADATA_ETHEREUM_FAILURE: {
      return RD.Failed(payload)
    }
    default:
      return state
  }
}
