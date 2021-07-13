import { set } from 'ramda'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, ROOT } from '../config'
import * as actions from './actions'
import reducer from './reducers'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore root reducers', () => {
  const typeId = derivationMap[ROOT]
  const rootObject = {
    mdid: 'mdid value',
    metadata: 'my xpriv'
  }

  const rootMetadata = set(
    KVStoreEntry.value,
    rootObject,
    KVStoreEntry.createEmpty(typeId)
  )

  const rootMetadataSuccess = Remote.Success(rootMetadata)

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_ROOT_LOADING', () => {
    const action = actions.fetchMetadataRootLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_ROOT_FAILURE', () => {
    const error = 'Cannot load root metadata'
    const action = actions.fetchMetadataRootFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_ROOT_SUCCESS', () => {
    const action = actions.fetchMetadataRootSuccess(rootMetadata)
    const expectedState = rootMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle UPDATE_METADATA_ROOT', () => {
    const action = actions.updateMetadataRoot(rootObject)
    const expectedState = rootMetadataSuccess
    expect(reducer(rootMetadataSuccess, action)).toEqual(expectedState)
  })
})
