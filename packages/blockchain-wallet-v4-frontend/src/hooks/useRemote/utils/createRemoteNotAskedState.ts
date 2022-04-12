import { RemoteHookState } from '../types'

export const createRemoteNotAskedState = <
  ERROR extends unknown = unknown,
  RESULT extends unknown = unknown
>(): RemoteHookState<ERROR, RESULT> => ({
  data: undefined,
  error: undefined,
  hasData: false,
  hasError: false,
  isLoading: false,
  isNotAsked: true
})
