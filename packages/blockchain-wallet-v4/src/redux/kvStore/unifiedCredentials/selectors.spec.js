import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore unifiedCredentials selectors', () => {
  const exchange_lifetime_token = 'e28c0e6e-1e88-405d-9d86-54803da4d5b5'
  const exchange_user_id = '5483ed6b-ae21-442c-a894-468c6f997fda'
  const nabu_lifetime_token = '9f515953-3573-4a66-b354-37473739f157'
  const nabu_user_id = '7dc07bc9-0ccf-4b1b-b28a-067e15415593'

  const unifiedCredentialsKvUnwrapped = {
    exchange_lifetime_token,
    exchange_user_id,
    nabu_lifetime_token,
    nabu_user_id
  }

  const unifiedCredentialsKv = {
    value: unifiedCredentialsKvUnwrapped
  }

  describe('loading states', () => {
    const loadingState = {
      kvStorePath: {
        unifiedCredentials: Remote.Loading
      }
    }

    it('getMetadata should return loading', () => {
      expect(selectors.getMetadata(loadingState)).toEqual(Remote.Loading)
    })

    it('getExchangeUserId should return loading', () => {
      expect(selectors.getExchangeUserId(loadingState)).toEqual(Remote.Loading)
    })

    it('getExchangeLifetimeToken should return loading', () => {
      expect(selectors.getExchangeLifetimeToken(loadingState)).toEqual(Remote.Loading)
    })

    it('getExchangeCredentials should return loading', () => {
      expect(selectors.getExchangeCredentials(loadingState)).toEqual(Remote.Loading)
    })

    it('getNabuUserId should return loading', () => {
      expect(selectors.getNabuUserId(loadingState)).toEqual(Remote.Loading)
    })

    it('getNabuLifetimeToken should return loading', () => {
      expect(selectors.getNabuLifetimeToken(loadingState)).toEqual(Remote.Loading)
    })

    it('getNabuCredentials should return loading', () => {
      expect(selectors.getNabuCredentials(loadingState)).toEqual(Remote.Loading)
    })

    it('getUnifiedOrLegacyNabuEntry should return loading', () => {
      const loadingState = {
        kvStorePath: {
          unifiedCredentials: Remote.Loading,
          userCredentials: Remote.Loading
        }
      }
      expect(selectors.getUnifiedOrLegacyNabuEntry(loadingState)).toEqual(Remote.Loading)
    })
  })

  describe('success states', () => {
    const successState = {
      kvStorePath: {
        unifiedCredentials: Remote.Success(unifiedCredentialsKv)
      }
    }

    it('getMetadata should return success of metadata', () => {
      expect(selectors.getMetadata(successState)).toEqual(Remote.Success(unifiedCredentialsKv))
    })

    it('getExchangeUserId should return success of metadata', () => {
      expect(selectors.getExchangeUserId(successState)).toEqual(
        Remote.Success(unifiedCredentialsKvUnwrapped.exchange_user_id)
      )
    })

    it('getExchangeLifetimeToken should return success of metadata', () => {
      expect(selectors.getExchangeLifetimeToken(successState)).toEqual(
        Remote.Success(unifiedCredentialsKvUnwrapped.exchange_lifetime_token)
      )
    })

    it('getExchangeCredentials should return success', () => {
      expect(selectors.getExchangeCredentials(successState)).toEqual(
        Remote.Success({
          exchangeLifetimeToken: unifiedCredentialsKvUnwrapped.exchange_lifetime_token,
          exchangeUserId: unifiedCredentialsKvUnwrapped.exchange_user_id
        })
      )
    })

    it('getNabuUserId should return success of metadata', () => {
      expect(selectors.getNabuUserId(successState)).toEqual(
        Remote.Success(unifiedCredentialsKvUnwrapped.nabu_user_id)
      )
    })

    it('getNabuLifetimeToken should return success of metadata', () => {
      expect(selectors.getNabuLifetimeToken(successState)).toEqual(
        Remote.Success(unifiedCredentialsKvUnwrapped.nabu_lifetime_token)
      )
    })

    it('getNabuCredentials should return success', () => {
      expect(selectors.getNabuCredentials(successState)).toEqual(
        Remote.Success({
          nabuLifetimeToken: unifiedCredentialsKvUnwrapped.nabu_lifetime_token,
          nabuUserId: unifiedCredentialsKvUnwrapped.nabu_user_id
        })
      )
    })

    it('getUnifiedOrLegacyNabuEntry should return unifiedCredentials properties when they exist', () => {
      expect(selectors.getUnifiedOrLegacyNabuEntry(successState)).toEqual(
        Remote.Success({
          nabuLifetimeToken: unifiedCredentialsKvUnwrapped.nabu_lifetime_token,
          nabuUserId: unifiedCredentialsKvUnwrapped.nabu_user_id
        })
      )
    })

    it('getUnifiedOrLegacyNabuEntry should return legacy (userCredentials) properties when unifiedCredentials dont exist', () => {
      const missingUnifiedCredentials = {
        kvStorePath: {
          unifiedCredentials: Remote.Success({
            value: {}
          }),
          userCredentials: Remote.Success({
            value: {
              lifetime_token: '6c5e88b3-91c5-4e24-8054-5e0510886f1b',
              user_id: '1e012e35-b5bf-4a9a-bfe4-1472931e163b'
            }
          })
        }
      }

      expect(selectors.getUnifiedOrLegacyNabuEntry(missingUnifiedCredentials)).toEqual(
        Remote.Success({
          nabuLifetimeToken: '6c5e88b3-91c5-4e24-8054-5e0510886f1b',
          nabuUserId: '1e012e35-b5bf-4a9a-bfe4-1472931e163b'
        })
      )
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

    it('getExchangeUserId should return failure in failure state', () => {
      expect(selectors.getExchangeUserId(failureState)).toEqual(expectedResult)
    })

    it('getExchangeLifetimeToken should return failure in failure state', () => {
      expect(selectors.getExchangeLifetimeToken(failureState)).toEqual(expectedResult)
    })

    it('getExchangeCredentials should return failure in failure state', () => {
      expect(selectors.getExchangeCredentials(failureState)).toEqual(expectedResult)
    })

    it('getNabuUserId should return failure in failure state', () => {
      expect(selectors.getNabuUserId(failureState)).toEqual(expectedResult)
    })

    it('getNabuLifetimeToken should return failure in failure state', () => {
      expect(selectors.getNabuLifetimeToken(failureState)).toEqual(expectedResult)
    })

    it('getNabuCredentials should return failure in failure state', () => {
      expect(selectors.getNabuCredentials(failureState)).toEqual(expectedResult)
    })
  })
})
