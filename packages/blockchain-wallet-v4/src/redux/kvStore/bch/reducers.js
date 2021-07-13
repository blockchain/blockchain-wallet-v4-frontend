import { assoc, assocPath, compose } from 'ramda'
import { mapped, over } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.FETCH_METADATA_BCH_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_BCH:
    case AT.FETCH_METADATA_BCH_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_BCH_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.SET_BCH_ACCOUNT_LABEL: {
      const { accountIdx, label } = action.payload
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setAccountLabel = assocPath(
        ['accounts', accountIdx, 'label'],
        label
      )
      return over(valueLens, setAccountLabel, state)
    }
    case AT.SET_BCH_ACCOUNT_ARCHIVED: {
      const { accountIdx, archived } = action.payload
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setAccountArchived = assocPath(
        ['accounts', accountIdx, 'archived'],
        archived
      )
      return over(valueLens, setAccountArchived, state)
    }
    case AT.SET_DEFAULT_BCH_ACCOUNT: {
      const { index } = action.payload
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setDefaultAccount = assoc('default_account_idx', index)
      return over(valueLens, setDefaultAccount, state)
    }
    case AT.SET_LEGACY_ADDR_BCH: {
      const { addr } = action.payload
      const valueLens = compose(mapped, KVStoreEntry.value)
      let setAddr = assocPath(['addresses', addr.addr], addr)
      return over(valueLens, setAddr, state)
    }
    case AT.SET_TRANSACTION_NOTE_BCH: {
      const { txHash, txNote } = action.payload
      let valueLens = compose(mapped, KVStoreEntry.value)
      let setNote = assocPath(['tx_notes', txHash], txNote)
      return over(valueLens, setNote, state)
    }

    default:
      return state
  }
}
