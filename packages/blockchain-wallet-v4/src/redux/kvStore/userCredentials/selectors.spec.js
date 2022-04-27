import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore userCredentials selectors', () => {
  const user_id = '3d448ad7-0e2c-4b65-91b0-c149892e243c'
  const lifetime_token = 'd753109e-23jd-42bd-82f1-cc904702asdfkjf'

  const userCredentialsMetadata = {
    value: { lifetime_token, user_id }
  }

  describe('success states', () => {
    const successState = {
      kvStorePath: {
        userCredentials: Remote.Success(userCredentialsMetadata)
      }
    }

    it('getMetadata should return success of metadata', () => {
      expect(selectors.getMetadata(successState)).toEqual(Remote.Success(userCredentialsMetadata))
    })

    it('getLegacyUserId should return success of user_id', () => {
      expect(selectors.getLegacyUserId(successState)).toEqual(Remote.Success(user_id))
    })

    it('getLegacyNabuLifetimeToken should return success of lifetime_token', () => {
      expect(selectors.getLegacyNabuLifetimeToken(successState)).toEqual(
        Remote.Success(lifetime_token)
      )
    })

    it('getLegacyNabuCredentials should return success of nabu credentials', () => {
      expect(selectors.getLegacyNabuCredentials(successState)).toEqual(
        Remote.Success({
          nabuLifetimeToken: lifetime_token,
          nabuUserId: user_id
        })
      )
    })
  })

  describe('loading states', () => {
    const loadingState = {
      kvStorePath: {
        userCredentials: Remote.Loading
      }
    }

    it('getMetadata should return loading', () => {
      expect(selectors.getMetadata(loadingState)).toEqual(Remote.Loading)
    })

    it('getLegacyUserId should return loading', () => {
      expect(selectors.getLegacyUserId(loadingState)).toEqual(Remote.Loading)
    })

    it('getLegacyNabuLifetimeToken should return loading', () => {
      expect(selectors.getLegacyNabuLifetimeToken(loadingState)).toEqual(Remote.Loading)
    })

    it('getLegacyNabuCredentials should return loading', () => {
      expect(selectors.getLegacyNabuLifetimeToken(loadingState)).toEqual(Remote.Loading)
    })
  })

  describe('failure states', () => {
    const failureState = {
      kvStorePath: {
        userCredentials: Remote.Failure('Error in userCredentials metadata')
      }
    }
    const expectedResult = Remote.Failure('Error in userCredentials metadata')

    it('getMetadata should return failure', () => {
      expect(selectors.getMetadata(failureState)).toEqual(expectedResult)
    })

    it('getLegacyUserId should return failure', () => {
      expect(selectors.getLegacyUserId(failureState)).toEqual(expectedResult)
    })

    it('getLegacyNabuLifetimeToken should return failure', () => {
      expect(selectors.getLegacyNabuLifetimeToken(failureState)).toEqual(expectedResult)
    })

    it('getLegacyNabuCredentials should return failure', () => {
      expect(selectors.getLegacyNabuCredentials(failureState)).toEqual(expectedResult)
    })
  })
})
