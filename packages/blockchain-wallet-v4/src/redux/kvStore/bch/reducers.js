import { assoc, assocPath, compose } from 'ramda'
import { dissocPath, mapped, over } from 'ramda-lens'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

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
      const setAccount = assocPath(['accounts', accountIdx, 'label'], label)
      return over(valueLens, setAccount, state)
    }
    case AT.SET_BCH_ACCOUNT_ARCHIVED: {
      const { accountIdx, archived } = action.payload
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setAccountArchived = assocPath(['accounts', accountIdx, 'archived'], archived)
      return over(valueLens, setAccountArchived, state)
    }
    case AT.SET_DEFAULT_BCH_ACCOUNT: {
      const { index } = action.payload
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setAccountArchived = assoc('default_account_idx', index)
      return over(valueLens, setAccountArchived, state)
    }
    case AT.SET_BCH_HD_ADDRESS_LABEL: {
      const { accountIdx, addressIdx, label } = action.payload
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setAccountArchived = assocPath(['accounts', accountIdx, 'address_labels', addressIdx], { index: addressIdx, label })
      return over(valueLens, setAccountArchived, state)
    }
    case AT.DELETE_BCH_HD_ADDRESS_LABEL: {
      const { accountIdx, addressIdx } = action.payload
      const valueLens = compose(mapped, KVStoreEntry.value)
      const deleteLabel = dissocPath(['accounts', accountIdx, 'addressLabels', addressIdx])

      return over(valueLens, deleteLabel)
    }
    default:
      return state
  }
}
