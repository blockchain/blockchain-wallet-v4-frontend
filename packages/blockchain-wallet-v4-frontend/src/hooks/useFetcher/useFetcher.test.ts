import { act, renderHook } from '@testing-library/react-hooks'

import useFetcher from './useFetcher'

const mockApiEndpoint = (promise) => {
  jest
    .spyOn(global, 'fetch')
    .mockImplementation(jest.fn(() => Promise.resolve({ json: () => promise })) as jest.Mock)
}

describe('useFetcher()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('When the API is available', () => {
    it('Should fetch the data from the API and parse the result', async () => {
      const promise = Promise.resolve({ message: 'Hello World' })

      mockApiEndpoint(promise)

      const { result } = renderHook(useFetcher, {
        initialProps: 'http://example.com'
      })

      expect(result.current).toEqual({
        data: undefined,
        error: undefined,
        isFetching: true,
        isLoading: true
      })

      await act(async () => {
        await promise
      })

      expect(result.current).toEqual({
        data: { message: 'Hello World' },
        error: undefined,
        isFetching: false,
        isLoading: false
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith('http://example.com')
    })

    it('Should not refetch if the hook is rerendered with the same endpoint', async () => {
      const promise = Promise.resolve({ message: 'Hello World' })

      mockApiEndpoint(promise)

      const { rerender } = renderHook(useFetcher, {
        initialProps: 'http://example.com'
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith('http://example.com')

      await act(async () => {
        await promise
      })

      rerender('http://example.com')

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('Should refetch only when the endpoint changed', async () => {
      const promise = Promise.resolve({ message: 'Hello World' })

      mockApiEndpoint(promise)

      const { rerender, result } = renderHook(useFetcher, {
        initialProps: 'http://example.com'
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith('http://example.com')

      await act(async () => {
        await promise
      })

      expect(result.current.data).toEqual({ message: 'Hello World' })
      expect(result.current.isLoading).toEqual(false)
      expect(result.current.isFetching).toEqual(false)

      const promiseOfSecondEndpoint = mockApiEndpoint({ message: 'Another data' })

      rerender('http://example-2.com')

      expect(result.current.isFetching).toEqual(true)
      expect(result.current.isLoading).toEqual(false)

      await act(() => promiseOfSecondEndpoint)

      expect(result.current.data).toEqual({ message: 'Another data' })
      expect(result.current.isLoading).toEqual(false)
      expect(result.current.isFetching).toEqual(false)

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenLastCalledWith('http://example-2.com')
    })
  })

  describe('When the API is not available', () => {
    it('Should handle the error and provide the error state', async () => {
      const error = new Error('Some 500 error')

      const promise = Promise.reject(error)

      mockApiEndpoint(promise)

      const { result } = renderHook(useFetcher, {
        initialProps: 'http://example.com'
      })

      await act(async () => {
        try {
          await promise
          /* eslint-disable no-empty */
        } catch (error) {}
      })

      expect(result.current).toEqual({
        data: undefined,
        error,
        isFetching: false,
        isLoading: false
      })
    })
  })
})
