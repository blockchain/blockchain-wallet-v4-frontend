import { assocPath, compose, set } from 'ramda'
import { mapped, over } from 'ramda-lens'
import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, BSV } from '../config'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore bsv reducers', () => {
  const typeId = derivationMap[BSV]
  const accounts = [
    { label: 'BSV A', archived: false },
    { label: 'BSV B', archived: false }
  ]

  const bsvMetadata = set(
    KVStoreEntry.value,
    {
      accounts,
      default_account_idx: 0,
      tx_notes: {
        dadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2: 'tx'
      }
    },
    KVStoreEntry.createEmpty(typeId)
  )

  const bsvMetadataSuccess = Remote.Success(bsvMetadata)
  const valueLens = compose(
    mapped,
    KVStoreEntry.value
  )

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_BSV_LOADING', () => {
    const action = actions.fetchMetadataBsvLoading()
    expect(reducer(undefined, action)).toEqual(Remote.Loading)
  })

  it('should handle FETCH_METADATA_BSV_FAILURE', () => {
    const error = 'Cannot load bsv metadata'
    const action = actions.fetchMetadataBsvFailure(error)
    expect(reducer(undefined, action)).toEqual(Remote.Failure(error))
  })

  it('should handle FETCH_METADATA_BSV_SUCCESS', () => {
    const action = actions.fetchMetadataBsvSuccess(bsvMetadata)
    expect(reducer(undefined, action)).toEqual(bsvMetadataSuccess)
  })

  it('should handle CREATE_METADATA_BSV', () => {
    const action = actions.createMetadataBsv(bsvMetadata)
    expect(reducer(undefined, action)).toEqual(bsvMetadataSuccess)
  })

  it('should handle SET_TRANSACTION_NOTE_BSV', () => {
    const txHash =
      'cadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2'
    const txNote = 'Hello, World!'
    const action = actions.setTxNotesBsv(txHash, txNote)
    const setTxNote = assocPath(['tx_notes', txHash], txNote)
    const expectedState = over(valueLens, setTxNote, bsvMetadataSuccess)
    expect(reducer(bsvMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_BSV_ACCOUNT_ARCHIVED', () => {
    const accountIdx = 2
    const action = actions.setAccountArchived(accountIdx, false)
    const setAccountArchived = assocPath(
      ['accounts', accountIdx, 'archived'],
      false
    )
    const expectedState = over(
      valueLens,
      setAccountArchived,
      bsvMetadataSuccess
    )
    expect(reducer(bsvMetadataSuccess, action)).toEqual(expectedState)
  })
})
