import { set } from 'ramda'
import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, CONTACTS } from '../config'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore contacts reducers', () => {
  const typeId = derivationMap[CONTACTS]

  const contactsMetadata = set(
    KVStoreEntry.value,
    {
      /* Enter mock contacts objects here */
    },
    KVStoreEntry.createEmpty(typeId)
  )

  const contactsMetadataSuccess = Remote.Success(contactsMetadata)

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_CONTACTS_LOADING', () => {
    const action = actions.fetchMetadataContactsLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_CONTACTS_FAILURE', () => {
    const error = 'Cannot load contacts metadata'
    const action = actions.fetchMetadataContactsFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_CONTACTS_SUCCESS', () => {
    const action = actions.fetchMetadataContactsSuccess(contactsMetadata)
    const expectedState = contactsMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle CREATE_METADATA_CONTACTS', () => {
    const action = actions.createMetadataContacts(contactsMetadata)
    const expectedState = contactsMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })
})
