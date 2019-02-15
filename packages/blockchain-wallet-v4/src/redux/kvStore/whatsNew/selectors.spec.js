import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore whatsNew selectors', () => {
  const lastViewed = 1522942568480

  const whatsNewMetadata = {
    value: { lastViewed }
  }

  const successState = {
    kvStorePath: {
      whatsNew: Remote.Success(whatsNewMetadata)
    }
  }

  it('getMetadata should return success of metadata', () => {
    const expectedResult = Remote.Success(whatsNewMetadata)
    expect(selectors.getMetadata(successState)).toEqual(expectedResult)
  })

  it('getLastViewed should return success of lastViewed', () => {
    const expectedResult = Remote.Success(lastViewed)
    expect(selectors.getLastViewed(successState)).toEqual(expectedResult)
  })

  const loadingState = {
    kvStorePath: {
      whatsNew: Remote.Loading
    }
  }

  it('getMetadata should return loading', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getMetadata(loadingState)).toEqual(expectedResult)
  })

  it('getLastViewed should return loading in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getLastViewed(loadingState)).toEqual(expectedResult)
  })

  const failureState = {
    kvStorePath: {
      whatsNew: Remote.Failure('Error in whatsNew metadata')
    }
  }

  it('getMetadata should return failure', () => {
    const expectedResult = Remote.Failure('Error in whatsNew metadata')
    expect(selectors.getMetadata(failureState)).toEqual(expectedResult)
  })

  it('getLastViewed should return failure in failure state', () => {
    const expectedResult = Remote.Failure('Error in whatsNew metadata')
    expect(selectors.getLastViewed(failureState)).toEqual(expectedResult)
  })
})
