import { assocPath, compose, toLower } from 'ramda'
import { mapped, over, set } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action
  switch (type) {
    case AT.UPDATE_METADATA_ETH: {
      return set(compose(mapped, KVStoreEntry.value), payload, state)
    }
    case AT.FETCH_METADATA_ETH_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_ETH:
    case AT.FETCH_METADATA_ETH_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_ETH_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.SET_TRANSACTION_NOTE_ETH: {
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setNote = assocPath(['ethereum', 'tx_notes', payload.txHash], payload.txNote)
      return over(valueLens, setNote, state)
    }
    case AT.SET_TRANSACTION_NOTE_ERC20: {
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setNote = assocPath(
        ['ethereum', 'erc20', toLower(payload.token), 'tx_notes', payload.txHash],
        payload.txNote
      )
      return over(valueLens, setNote, state)
    }
    case AT.SET_LATEST_TX_ETH: {
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setTx = assocPath(['ethereum', 'last_tx'], payload)
      return over(valueLens, setTx, state)
    }
    case AT.SET_LATEST_TX_TIMESTAMP_ETH: {
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setTxTimestamp = assocPath(['ethereum', 'last_tx_timestamp'], payload)
      return over(valueLens, setTxTimestamp, state)
    }
    case AT.SET_ERC0_HAS_SEEN: {
      const valueLens = compose(mapped, KVStoreEntry.value)
      const setHasSeen = assocPath(['ethereum', 'erc20', toLower(payload.token), 'has_seen'], true)
      return over(valueLens, setHasSeen, state)
    }
    default:
      return state
  }
}
