import { RemoteHookState } from '../types'

export const createRemoteFailureState = <
  ERROR extends unknown = unknown,
  RESULT extends unknown = unknown
>(
  error: ERROR
): RemoteHookState<ERROR, RESULT> => ({
  error,
  hasData: false,
  hasError: true,
  isLoading: false,
  isNotAsked: false
})
