import { set } from 'ramda'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, UNIFIED_CREDENTIALS } from '../config'
import * as actions from './actions'
import reducer from './reducers'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore unifiedCredentials reducers', () => {
  const typeId = derivationMap[UNIFIED_CREDENTIALS]
  const unifiedCredentialsObject = {
    exchange_lifetime_token: 'e28c0e6e-1e88-405d-9d86-54803da4d5b5',
    exchange_user_id: '5483ed6b-ae21-442c-a894-468c6f997fda',
    nabu_lifetime_token: '9f515953-3573-4a66-b354-37473739f157',
    nabu_user_id: '7dc07bc9-0ccf-4b1b-b28a-067e15415593'
  }

  const unifiedCredentialsMetadata = set(
    KVStoreEntry.value,
    unifiedCredentialsObject,
    KVStoreEntry.createEmpty(typeId)
  )

  const unifiedCredentialsMetadataSuccess = Remote.Success(unifiedCredentialsMetadata)

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_UNIFIED_CREDENTIALS_LOADING', () => {
    const action = actions.fetchMetadataUnifiedCredentialsLoading()
    expect(reducer(undefined, action)).toEqual(Remote.Loading)
  })

  it('should handle FETCH_METADATA_UNIFIED_CREDENTIALS_FAILURE', () => {
    const error = 'Cannot load unifiedCredentials metadata'
    const action = actions.fetchMetadataUnifiedCredentialsFailure(error)
    expect(reducer(undefined, action)).toEqual(Remote.Failure(error))
  })

  it('should handle FETCH_METADATA_UNIFIED_CREDENTIALS_SUCCESS', () => {
    const action = actions.fetchMetadataUnifiedCredentialsSuccess(unifiedCredentialsMetadata)
    expect(reducer(undefined, action)).toEqual(unifiedCredentialsMetadataSuccess)
  })

  it('should handle CREATE_METADATA_UNIFIED_CREDENTIALS', () => {
    const action = actions.createMetadataUnifiedCredentials(unifiedCredentialsMetadata)
    expect(reducer(undefined, action)).toEqual(unifiedCredentialsMetadataSuccess)
  })

  it('should handle SET_UNIFIED_CREDENTIALS passing all values', () => {
    const new_exchange_lifetime_token = 'e28c0e6e-1e88-405d-9d86-54803da4d5b5'
    const new_exchange_user_id = '5483ed6b-ae21-442c-a894-468c6f997fda'
    const new_nabu_lifetime_token = '9f515953-3573-4a66-b354-37473739f157'
    const new_nabu_user_id = '7dc07bc9-0ccf-4b1b-b28a-067e15415593'
    const action = actions.setUnifiedCredentials({
      exchange_lifetime_token: new_exchange_lifetime_token,
      exchange_user_id: new_exchange_user_id,
      nabu_lifetime_token: new_nabu_lifetime_token,
      nabu_user_id: new_nabu_user_id
    })
    const expectedState = Remote.Success(
      set(
        KVStoreEntry.value,
        {
          exchange_lifetime_token: new_exchange_lifetime_token,
          exchange_user_id: new_exchange_user_id,
          nabu_lifetime_token: new_nabu_lifetime_token,
          nabu_user_id: new_nabu_user_id
        },
        KVStoreEntry.createEmpty(typeId)
      )
    )
    expect(reducer(unifiedCredentialsMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_UNIFIED_CREDENTIALS with only partial entries passed', () => {
    const new_exchange_lifetime_token = 'e28c0e6e-1e88-405d-9d86-54803da4d5b5'
    const new_exchange_user_id = '5483ed6b-ae21-442c-a894-468c6f997fda'

    const action = actions.setUnifiedCredentials({
      exchange_lifetime_token: new_exchange_lifetime_token,
      exchange_user_id: new_exchange_user_id
    })
    const expectedState = Remote.Success(
      set(
        KVStoreEntry.value,
        {
          exchange_lifetime_token: new_exchange_lifetime_token,
          exchange_user_id: new_exchange_user_id,
          nabu_lifetime_token: unifiedCredentialsObject.nabu_lifetime_token,
          nabu_user_id: unifiedCredentialsObject.nabu_user_id
        },
        KVStoreEntry.createEmpty(typeId)
      )
    )
    expect(reducer(unifiedCredentialsMetadataSuccess, action)).toEqual(expectedState)
  })
})
