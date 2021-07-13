import { assocPath, compose, set } from 'ramda'
import { mapped, over } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { BCH, derivationMap } from '../config'
import * as actions from './actions'
import reducer from './reducers'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore bch reducers', () => {
  const typeId = derivationMap[BCH]
  const accounts = [
    { label: 'a', archived: false },
    { label: 'b', archived: false },
    { label: 'c', archived: true }
  ]

  const bchMetadata = set(
    KVStoreEntry.value,
    {
      accounts,
      default_account_idx: 2,
      tx_notes: {
        dadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2: 'tx'
      }
    },
    KVStoreEntry.createEmpty(typeId)
  )

  const bchMetadataSuccess = Remote.Success(bchMetadata)
  const valueLens = compose(mapped, KVStoreEntry.value)

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_BCH_LOADING', () => {
    const action = actions.fetchMetadataBchLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_BCH_FAILURE', () => {
    const error = 'Cannot load bch metadata'
    const action = actions.fetchMetadataBchFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_BCH_SUCCESS', () => {
    const action = actions.fetchMetadataBchSuccess(bchMetadata)
    const expectedState = bchMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle CREATE_METADATA_BCH', () => {
    const action = actions.createMetadataBch(bchMetadata)
    const expectedState = bchMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle SET_BCH_ACCOUNT_LABEL', () => {
    const accountIdx = 1
    const label = 'hello'
    const action = actions.setAccountLabel(accountIdx, label)
    const setAccountLabel = assocPath(['accounts', accountIdx, 'label'], label)
    const expectedState = over(valueLens, setAccountLabel, bchMetadataSuccess)
    expect(reducer(bchMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_BCH_ACCOUNT_ARCHIVED true', () => {
    const accountIdx = 1
    const archived = true
    const action = actions.setAccountArchived(accountIdx, archived)
    const setAccountArchived = assocPath(
      ['accounts', accountIdx, 'archived'],
      archived
    )
    const expectedState = over(
      valueLens,
      setAccountArchived,
      bchMetadataSuccess
    )
    expect(reducer(bchMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_BCH_ACCOUNT_ARCHIVED false', () => {
    const accountIdx = 2
    const archived = false
    const action = actions.setAccountArchived(accountIdx, archived)
    const setAccountArchived = assocPath(
      ['accounts', accountIdx, 'archived'],
      archived
    )
    const expectedState = over(
      valueLens,
      setAccountArchived,
      bchMetadataSuccess
    )
    expect(reducer(bchMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_DEFAULT_BCH_ACCOUNT', () => {
    const index = 0
    const action = actions.setDefaultAccountIdx(index)
    const setDefaultBchAccount = assocPath(['default_account_idx'], index)
    const expectedState = over(
      valueLens,
      setDefaultBchAccount,
      bchMetadataSuccess
    )
    expect(reducer(bchMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_TRANSACTION_NOTE_BCH', () => {
    const txHash =
      'cadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2'
    const txNote = 'Hello, World!'
    const action = actions.setTxNotesBch(txHash, txNote)
    const setTxNote = assocPath(['tx_notes', txHash], txNote)
    const expectedState = over(valueLens, setTxNote, bchMetadataSuccess)
    expect(reducer(bchMetadataSuccess, action)).toEqual(expectedState)
  })
})
