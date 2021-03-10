import { assocPath, compose, set } from 'ramda'
import { mapped, over } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, ETH } from '../config'
import * as actions from './actions'
import reducer from './reducers'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore ethereum reducers', () => {
  const typeId = derivationMap[ETH]
  const ethObject = {
    ethereum: {
      accounts: [
        {
          addr: 'some address',
          label: 'some label'
        }
      ],
      last_tx: { address: 'this is the last tx' },
      last_tx_timestamp: { address: 'this is the last tx timestamp' },
      legacy_account: 'this is the legacy account',
      tx_notes: {
        someTxHash: 'some someTxHash tx note'
      }
    }
  }

  const ethMetadata = set(
    KVStoreEntry.value,
    ethObject,
    KVStoreEntry.createEmpty(typeId)
  )

  const ethMetadataSuccess = Remote.Success(ethMetadata)
  const valueLens = compose(mapped, KVStoreEntry.value)

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_ETH_LOADING', () => {
    const action = actions.fetchMetadataEthLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_ETH_FAILURE', () => {
    const error = 'Cannot load ethereum metadata'
    const action = actions.fetchMetadataEthFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_ETH_SUCCESS', () => {
    const action = actions.fetchMetadataEthSuccess(ethMetadata)
    const expectedState = ethMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle CREATE_METADATA_ETH', () => {
    const action = actions.createMetadataEth(ethMetadata)
    const expectedState = ethMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle SET_TRANSACTION_NOTE_ETH', () => {
    const txHash = 'someTxHash'
    const txNote = 'new tx note'
    const action = actions.setTxNotesEth(txHash, txNote)
    const setTxNote = assocPath(['ethereum', 'tx_notes', txHash], txNote)
    const expectedState = over(valueLens, setTxNote, ethMetadataSuccess)
    expect(reducer(ethMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_LATEST_TX_ETH', () => {
    const latestTx = 'latest tx'
    const action = actions.setLatestTxEth(latestTx)
    const setLastTx = assocPath(['ethereum', 'last_tx'], latestTx)
    const expectedState = over(valueLens, setLastTx, ethMetadataSuccess)
    expect(reducer(ethMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_LATEST_TX_TIMESTAMP_ETH', () => {
    const latestTimestamp = 42
    const action = actions.setLatestTxTimestampEth(latestTimestamp)
    const setLatestTimestamp = assocPath(
      ['ethereum', 'last_tx_timestamp'],
      latestTimestamp
    )
    const expectedState = over(
      valueLens,
      setLatestTimestamp,
      ethMetadataSuccess
    )
    expect(reducer(ethMetadataSuccess, action)).toEqual(expectedState)
  })
})
