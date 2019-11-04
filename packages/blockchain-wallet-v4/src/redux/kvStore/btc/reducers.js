import * as AT from './actionTypes'
import { assocPath, compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { mapped, over } from 'ramda-lens'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_METADATA_BTC_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_BTC:
    case AT.FETCH_METADATA_BTC_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_BTC_FAILURE: {
      return Remote.Failure(payload)
    }

    case AT.ADD_ADDRESS_LABEL: {
      const { address, label } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setLabel = assocPath(['address_labels', address], label)
      return over(valueLens, setLabel, state)
    }

    default:
      return state
  }
}
