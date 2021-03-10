import { assocPath, compose } from 'ramda'
import { mapped, over, set } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action
  switch (type) {
    case AT.UPDATE_METADATA_XLM: {
      return set(compose(mapped, KVStoreEntry.value), payload, state)
    }
    case AT.FETCH_METADATA_XLM_LOADING: {
      return Remote.Loading
    }
    case AT.SET_TRANSACTION_NOTE_XLM: {
      let valueLens = compose(mapped, KVStoreEntry.value)
      let setNote = assocPath(['tx_notes', payload.txHash], payload.txNote)
      return over(valueLens, setNote, state)
    }
    case AT.CREATE_METADATA_XLM:
    case AT.FETCH_METADATA_XLM_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_XLM_FAILURE: {
      return Remote.Failure(payload)
    }
    default:
      return state
  }
}
