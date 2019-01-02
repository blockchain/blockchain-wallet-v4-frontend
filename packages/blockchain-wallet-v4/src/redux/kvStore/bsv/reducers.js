import { assocPath, compose } from 'ramda'
import { mapped, over } from 'ramda-lens'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import Remote from '../../../remote'

const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_METADATA_BSV_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_BSV:
    case AT.FETCH_METADATA_BSV_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_BSV_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.SET_TRANSACTION_NOTE_BSV: {
      const { txHash, txNote } = action.payload
      let valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setNote = assocPath(['tx_notes', txHash], txNote)
      return over(valueLens, setNote, state)
    }
    case AT.SET_BSV_ACCOUNT_ARCHIVED: {
      const { accountIdx, archived } = action.payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const setAccountArchived = assocPath(
        ['accounts', accountIdx, 'archived'],
        archived
      )
      return over(valueLens, setAccountArchived, state)
    }
    default:
      return state
  }
}
