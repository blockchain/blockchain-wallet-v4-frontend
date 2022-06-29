import { DefaultRootState, useSelector } from 'react-redux'

import { Remote } from '@core'

import { RemoteHookSelector, RemoteHookState } from './types'
import {
  createRemoteFailureState,
  createRemoteLoadingState,
  createRemoteNotAskedState,
  createRemoteSuccessState
} from './utils'

export const useRemote = <
  ERROR extends unknown = unknown,
  RESULT extends unknown = unknown,
  STATE extends DefaultRootState = DefaultRootState
>(
  selector: RemoteHookSelector<ERROR, RESULT, STATE>
): RemoteHookState<ERROR, RESULT> => {
  const remote = useSelector(selector)

  if (Remote.Loading.is(remote)) return createRemoteLoadingState()

  if (Remote.Success.is(remote)) return createRemoteSuccessState(remote.data)

  if (Remote.Failure.is(remote)) return createRemoteFailureState(remote['@@values'][0] as ERROR)

  return createRemoteNotAskedState()
}
