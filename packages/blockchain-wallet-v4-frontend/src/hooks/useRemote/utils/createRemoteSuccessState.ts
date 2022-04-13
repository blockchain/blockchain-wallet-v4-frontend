import { RemoteHookState } from '../types'

export const createRemoteSuccessState = <
  ERROR extends unknown = unknown,
  RESULT extends unknown = unknown
>(
  data: RESULT
): RemoteHookState<ERROR, RESULT> => ({
  data,
  hasData: true,
  hasError: false,
  isLoading: false,
  isNotAsked: false
})
