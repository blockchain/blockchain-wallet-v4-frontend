import { assocPath } from 'ramda'
import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore contacts selectors', () => {
  const contactsMetadata = {}

  const successState = {
    kvStorePath: {
      contacts: Remote.Success(contactsMetadata)
    }
  }

  it('getMetadata should return success of metadata', () => {
    const expectedResult = Remote.Success(contactsMetadata)
    expect(selectors.getMetadata(successState)).toEqual(expectedResult)
  })

  const loadingState = assocPath(
    ['kvStorePath', 'contacts'],
    Remote.Loading,
    successState
  )

  it('getMetadata should return metadata loading', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getMetadata(loadingState)).toEqual(expectedResult)
  })

  const failureState = assocPath(
    ['kvStorePath', 'contacts'],
    Remote.Failure('Failure in contacts metadata'),
    successState
  )

  it('getMetadata should return metadata failure', () => {
    const error = 'Failure in contacts metadata'
    const expectedResult = Remote.Failure(error)
    expect(selectors.getMetadata(failureState)).toEqual(expectedResult)
  })
})
