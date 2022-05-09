import { useCallback, useEffect, useState } from 'react'

import { FetcherHookData } from './useFetcher.types'

const useFetcher = <T extends unknown = unknown, E extends object = object>(path: string) => {
  const [state, setState] = useState<FetcherHookData<T, E>>({
    data: undefined,
    isFetching: false,
    isLoading: false
  })

  const startFetch = useCallback(
    async (path: string) => {
      try {
        setState((state) => ({
          data: state.data,
          error: undefined,
          isFetching: true,
          isLoading: state.data === undefined
        }))

        const response = await fetch(path)

        const data: T = await response.json()

        setState({
          data,
          isFetching: false,
          isLoading: false
        })
      } catch (error) {
        setState({
          data: undefined,
          error,
          isFetching: false,
          isLoading: false
        })
      }
    },
    [setState]
  )

  useEffect(() => {
    startFetch(path)
  }, [path])

  return state
}

export default useFetcher
