import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore unifiedCredentials selectors', () => {
  const exchange_lifetime_token = 'e28c0e6e-1e88-405d-9d86-54803da4d5b5'
  const exchange_user_id = '5483ed6b-ae21-442c-a894-468c6f997fda'
  const nabu_lifetime_token = '9f515953-3573-4a66-b354-37473739f157'
  const nabu_user_id = '7dc07bc9-0ccf-4b1b-b28a-067e15415593'

  const unifiedCredentialsMetadata = {
    value: { exchange_lifetime_token, exchange_user_id, nabu_lifetime_token, nabu_user_id }
  }

  describe('loading states', () => {
    const loadingState = {
      kvStorePath: {
        unifiedCredentials: Remote.Loading
      }
    }
    const expectedResult = Remote.Loading

    it('getMetadata should return loading', () => {
      expect(selectors.getMetadata(loadingState)).toEqual(expectedResult)
    })

    it('getNabuUserId should return loading in loading state', () => {
      expect(selectors.getNabuUserId(loadingState)).toEqual(expectedResult)
    })

    it('getNabuLifetimeToken should return loading in loading state', () => {
      expect(selectors.getNabuLifetimeToken(loadingState)).toEqual(expectedResult)
    })

    it('getExchangeUserId should return loading in loading state', () => {
      expect(selectors.getNabuUserId(loadingState)).toEqual(expectedResult)
    })

    it('getExchangeLifetimeToken should return loading in loading state', () => {
      expect(selectors.getNabuLifetimeToken(loadingState)).toEqual(expectedResult)
    })
  })

  describe('success states', () => {
    const successState = {
      kvStorePath: {
        unifiedCredentials: Remote.Success(unifiedCredentialsMetadata)
      }
    }

    it('getMetadata should return success of metadata', () => {
      const expectedResult = Remote.Success(unifiedCredentialsMetadata)
      expect(selectors.getMetadata(successState)).toEqual(expectedResult)
    })

    it('getNabuUserId should return success of nabu_user_id', () => {
      const expectedResult = Remote.Success(nabu_user_id)
      expect(selectors.getNabuUserId(successState)).toEqual(expectedResult)
    })

    it('getNabuLifetimeToken should return success of nabu_lifetime_token', () => {
      const expectedResult = Remote.Success(nabu_lifetime_token)
      expect(selectors.getNabuLifetimeToken(successState)).toEqual(expectedResult)
    })

    it('getExchangeUserId should return success of nabu_user_id', () => {
      const expectedResult = Remote.Success(exchange_user_id)
      expect(selectors.getExchangeUserId(successState)).toEqual(expectedResult)
    })

    it('getExchangeLifetimeToken should return success of nabu_lifetime_token', () => {
      const expectedResult = Remote.Success(exchange_lifetime_token)
      expect(selectors.getExchangeLifetimeToken(successState)).toEqual(expectedResult)
    })
  })

  describe('failure states', () => {
    const failureState = {
      kvStorePath: {
        unifiedCredentials: Remote.Failure('Error in unifiedCredentials metadata')
      }
    }
    const expectedResult = Remote.Failure('Error in unifiedCredentials metadata')

    it('getMetadata should return failure', () => {
      expect(selectors.getMetadata(failureState)).toEqual(expectedResult)
    })

    it('getNabuUserId should return failure in failure state', () => {
      expect(selectors.getNabuUserId(failureState)).toEqual(expectedResult)
    })

    it('getNabuLifetimeToken should return failure in failure state', () => {
      expect(selectors.getNabuLifetimeToken(failureState)).toEqual(expectedResult)
    })

    it('getExchangeUserId should return failure in failure state', () => {
      expect(selectors.getExchangeUserId(failureState)).toEqual(expectedResult)
    })

    it('getExchangeLifetimeToken should return failure in failure state', () => {
      expect(selectors.getExchangeLifetimeToken(failureState)).toEqual(expectedResult)
    })
  })
})
