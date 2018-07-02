import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore root selectors', () => {
  const rootMetadata = {
    value: {
      mdid: 'mdid value',
      metadata: 'my xpriv'
    }
  }

  const successState = {
    kvStorePath: {
      root: Remote.Success(rootMetadata)
    }
  }

  it('getMetadataXpriv should return success of metadata xpriv in success state', () => {
    const expectedResult = 'my xpriv'
    expect(selectors.getMetadataXpriv(successState)).toEqual(expectedResult)
  })

  const loadingState = {
    kvStorePath: {
      root: Remote.Loading
    }
  }

  it('getMetadataXpriv should return null in loading state', () => {
    const expectedResult = null
    expect(selectors.getMetadataXpriv(loadingState)).toEqual(expectedResult)
  })

  const failureState = {
    kvStorePath: {
      root: Remote.Failure('Error loading root metadata')
    }
  }

  it('getMetadataXpriv should return null in failure state', () => {
    const expectedResult = null
    expect(selectors.getMetadataXpriv(failureState)).toEqual(expectedResult)
  })
})
