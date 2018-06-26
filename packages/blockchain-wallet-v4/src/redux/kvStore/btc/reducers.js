import * as AT from './actionTypes'
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
      return assocPath(['address_labels', address], label, state)
    }

    default:
      return state
  }
}
