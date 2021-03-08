import { set } from 'ramda'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, USER_CREDENTIALS } from '../config'
import * as actions from './actions'
import reducer from './reducers'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore userCredentials reducers', () => {
  const typeId = derivationMap[USER_CREDENTIALS]
  const user_id = '3d448ad7-0e2c-4b65-91b0-c149892e243c'
  const lifetime_token = 'd753109e-23jd-42bd-82f1-cc904702asdfkjf'

  const userCredentialsObject = { user_id, lifetime_token }

  const userCredentialsMetadata = set(
    KVStoreEntry.value,
    userCredentialsObject,
    KVStoreEntry.createEmpty(typeId)
  )

  const userCredentialsMetadataSuccess = Remote.Success(userCredentialsMetadata)

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_USER_CREDENTIALS_LOADING', () => {
    const action = actions.fetchMetadataUserCredentialsLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_USER_CREDENTIALS_FAILURE', () => {
    const error = 'Cannot load userCredentials metadata'
    const action = actions.fetchMetadataUserCredentialsFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_USER_CREDENTIALS_SUCCESS', () => {
    const action = actions.fetchMetadataUserCredentialsSuccess(
      userCredentialsMetadata
    )
    const expectedState = userCredentialsMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle CREATE_METADATA_USER_CREDENTIALS', () => {
    const action = actions.createMetadataUserCredentials(
      userCredentialsMetadata
    )
    const expectedState = userCredentialsMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle SET_USER_CREDENTIALS', () => {
    const newUserId = '3d448ad7-0e2c-4b65-91b0-c149892e243d'
    const newToken = 'd753109e-23jd-42bd-82f1-cc904702asdfkje'
    const action = actions.setUserCredentials(newUserId, newToken)
    const expectedState = Remote.Success(
      set(
        KVStoreEntry.value,
        { lifetime_token: newToken, user_id: newUserId },
        KVStoreEntry.createEmpty(typeId)
      )
    )
    expect(reducer(userCredentialsMetadataSuccess, action)).toEqual(
      expectedState
    )
  })
})
