import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore userCredentials selectors', () => {
  const user_id = '3d448ad7-0e2c-4b65-91b0-c149892e243c'
  const lifetime_token = 'd753109e-23jd-42bd-82f1-cc904702asdfkjf'

  const userCredentialsMetadata = {
    value: { user_id, lifetime_token }
  }

  const successState = {
    kvStorePath: {
      userCredentials: Remote.Success(userCredentialsMetadata)
    }
  }

  it('getMetadata should return success of metadata', () => {
    const expectedResult = Remote.Success(userCredentialsMetadata)
    expect(selectors.getMetadata(successState)).toEqual(expectedResult)
  })

  it('getUserId should return success of user_id', () => {
    const expectedResult = Remote.Success(user_id)
    expect(selectors.getUserId(successState)).toEqual(expectedResult)
  })

  it('getLifetimeToken should return success of lifetime_token', () => {
    const expectedResult = Remote.Success(lifetime_token)
    expect(selectors.getLifetimeToken(successState)).toEqual(expectedResult)
  })

  const loadingState = {
    kvStorePath: {
      userCredentials: Remote.Loading
    }
  }

  it('getMetadata should return loading', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getMetadata(loadingState)).toEqual(expectedResult)
  })

  it('getUserId should return loading in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getUserId(loadingState)).toEqual(expectedResult)
  })

  it('getLifetimeToken should return loading in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getLifetimeToken(loadingState)).toEqual(expectedResult)
  })

  const failureState = {
    kvStorePath: {
      userCredentials: Remote.Failure('Error in userCredentials metadata')
    }
  }

  it('getMetadata should return failure', () => {
    const expectedResult = Remote.Failure('Error in userCredentials metadata')
    expect(selectors.getMetadata(failureState)).toEqual(expectedResult)
  })

  it('getUserId should return failure in failure state', () => {
    const expectedResult = Remote.Failure('Error in userCredentials metadata')
    expect(selectors.getUserId(failureState)).toEqual(expectedResult)
  })

  it('getLifetimeToken should return failure in failure state', () => {
    const expectedResult = Remote.Failure('Error in userCredentials metadata')
    expect(selectors.getLifetimeToken(failureState)).toEqual(expectedResult)
  })
})
