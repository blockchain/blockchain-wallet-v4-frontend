import { set } from 'ramda'
import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, WHATSNEW } from '../config'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore whatsnew reducers', () => {
  const typeId = derivationMap[WHATSNEW]
  const whatsnewObject = {
    lastViewed: 1522942568480
  }

  const whatsnewMetadata = set(
    KVStoreEntry.value,
    whatsnewObject,
    KVStoreEntry.createEmpty(typeId)
  )

  const whatsnewMetadataSuccess = Remote.Success(whatsnewMetadata)

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_WHATSNEW_LOADING', () => {
    const action = actions.fetchMetadataWhatsnewLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_WHATSNEW_FAILURE', () => {
    const error = 'Cannot load whatsnew metadata'
    const action = actions.fetchMetadataWhatsnewFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_WHATSNEW_SUCCESS', () => {
    const action = actions.fetchMetadataWhatsnewSuccess(whatsnewMetadata)
    const expectedState = whatsnewMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle CREATE_METADATA_WHATSNEW', () => {
    const action = actions.createMetadataWhatsnew(whatsnewMetadata)
    const expectedState = whatsnewMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })
})
