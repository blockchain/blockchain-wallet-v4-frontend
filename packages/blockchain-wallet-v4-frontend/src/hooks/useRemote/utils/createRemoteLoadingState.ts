import { RemoteHookState } from '../types'

export const createRemoteLoadingState = <
  ERROR extends unknown = unknown,
  RESULT extends unknown = unknown
>(): RemoteHookState<ERROR, RESULT> => ({
  hasData: false,
  hasError: false,
  isLoading: true,
  isNotAsked: false
})
