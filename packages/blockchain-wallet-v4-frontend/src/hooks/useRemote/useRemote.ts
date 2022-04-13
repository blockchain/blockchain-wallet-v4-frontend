import { DefaultRootState, useSelector } from 'react-redux'

import { RemoteDataType } from '@core/types'

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
  const data = useSelector(selector)

  const remoteDataState = data['@@tag']

  const mapRemoteDataStateToRemoteHookBaseState: Record<
    'NotAsked' | 'Failure' | 'Loading' | 'Success',
    (data: RemoteDataType<ERROR, RESULT>) => RemoteHookState<ERROR, RESULT>
  > = {
    Failure: (data) => createRemoteFailureState(data['@@values'][0] as ERROR),
    Loading: createRemoteLoadingState,
    NotAsked: createRemoteNotAskedState,
    Success: ({ data }) => createRemoteSuccessState(data)
  }

  const stateBuilder = mapRemoteDataStateToRemoteHookBaseState[remoteDataState]

  return stateBuilder(data)
}
