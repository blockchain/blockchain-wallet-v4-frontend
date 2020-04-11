import * as AT from './actionTypes'
import { assoc, compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { mapped, over, set } from 'ramda-lens'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.UPDATE_METADATA_BUYSELL: {
      return set(
        compose(
          mapped,
          KVStoreEntry.value
        ),
        payload,
        state
      )
    }
    case AT.FETCH_METADATA_BUYSELL_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_BUYSELL:
    case AT.FETCH_METADATA_BUYSELL_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_BUYSELL_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.WIPE_EXTERNAL: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const wipe = assoc('coinify', { trades: [] })
      return over(valueLens, wipe, state)
    }
    default:
      return state
  }
}
