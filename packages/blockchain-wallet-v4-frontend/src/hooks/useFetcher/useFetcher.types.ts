type FetcherHookData<T, E extends object = object> = {
  data?: T
  error?: E
  isFetching: boolean
  isLoading: boolean
}

export type { FetcherHookData }
