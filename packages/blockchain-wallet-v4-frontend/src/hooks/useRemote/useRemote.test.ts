import { renderHook } from '@testing-library/react-hooks'

import { Remote } from '@core'

import { useRemote } from '.'

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useSelector: jest.fn((selector) => selector())
  }
})

describe('useRemote', () => {
  it('Should return the empty state when there is no data', () => {
    const { result } = renderHook(() => useRemote(() => Remote.NotAsked))

    const state = result.current

    expect(state).toEqual({
      data: undefined,
      hasData: false,
      hasError: false,
      isLoading: false,
      isNotAsked: true
    })
  })

  it('Should return the loading state when remote data is loading', () => {
    const { result } = renderHook(() => useRemote(() => Remote.Loading))

    const state = result.current

    expect(state).toEqual({
      data: undefined,
      hasData: false,
      hasError: false,
      isLoading: true,
      isNotAsked: false
    })
  })

  it('Should return the data state when remote data is a success', () => {
    const { result } = renderHook(() => useRemote(() => Remote.of('Jhon Doe')))

    const state = result.current

    expect(state).toEqual({
      data: 'Jhon Doe',
      hasData: true,
      hasError: false,
      isLoading: false,
      isNotAsked: false
    })
  })

  it('Should return the error state whne the remote data failed to load data', () => {
    const error = Error('There was a problem.')
    const { result } = renderHook(() => useRemote(() => Remote.Failure(error)))

    const state = result.current

    expect(state).toEqual({
      data: undefined,
      error,
      hasData: false,
      hasError: true,
      isLoading: false,
      isNotAsked: false
    })
  })
})
