import { assocPath, compose, set } from 'ramda'
import { mapped, over } from 'ramda-lens'
import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, ETHEREUM } from '../config'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore ethereum reducers', () => {
  const typeId = derivationMap[ETHEREUM]
  const ethereumObject = {
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

  const ethereumMetadata = set(
    KVStoreEntry.value,
    ethereumObject,
    KVStoreEntry.createEmpty(typeId)
  )

  const ethereumMetadataSuccess = Remote.Success(ethereumMetadata)
  const valueLens = compose(
    mapped,
    KVStoreEntry.value
  )

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_ETHEREUM_LOADING', () => {
    const action = actions.fetchMetadataEthereumLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_ETHEREUM_FAILURE', () => {
    const error = 'Cannot load ethereum metadata'
    const action = actions.fetchMetadataEthereumFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_ETHEREUM_SUCCESS', () => {
    const action = actions.fetchMetadataEthereumSuccess(ethereumMetadata)
    const expectedState = ethereumMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle CREATE_METADATA_ETHEREUM', () => {
    const action = actions.createMetadataEthereum(ethereumMetadata)
    const expectedState = ethereumMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle SET_TRANSACTION_NOTE_ETHEREUM', () => {
    const txHash = 'someTxHash'
    const txNote = 'new tx note'
    const action = actions.setTxNotesEthereum(txHash, txNote)
    const setTxNote = assocPath(['ethereum', 'tx_notes', txHash], txNote)
    const expectedState = over(valueLens, setTxNote, ethereumMetadataSuccess)
    expect(reducer(ethereumMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_LATEST_TX_ETHEREUM', () => {
    const latestTx = 'latest tx'
    const action = actions.setLatestTxEthereum(latestTx)
    const setCoinifyTrades = assocPath(['ethereum', 'last_tx'], latestTx)
    const expectedState = over(
      valueLens,
      setCoinifyTrades,
      ethereumMetadataSuccess
    )
    expect(reducer(ethereumMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_LATEST_TX_TIMESTAMP_ETHEREUM', () => {
    const latestTimestamp = 42
    const action = actions.setLatestTxTimestampEthereum(latestTimestamp)
    const setLatestTimestamp = assocPath(
      ['ethereum', 'last_tx_timestamp'],
      latestTimestamp
    )
    const expectedState = over(
      valueLens,
      setLatestTimestamp,
      ethereumMetadataSuccess
    )
    expect(reducer(ethereumMetadataSuccess, action)).toEqual(expectedState)
  })
})
