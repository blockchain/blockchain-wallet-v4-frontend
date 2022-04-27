import { DefaultRootState } from 'react-redux'
import {
  RemoteHookSelector,
  RemoteHookState
} from 'blockchain-wallet-v4-frontend/src/hooks/useRemote'

export type CoinRemoteHookUtilityProps<ERROR, RESULT, T, STATE extends DefaultRootState> = {
  mapper: (data: T) => RESULT
  selector: RemoteHookSelector<ERROR, T, STATE>
}

export type CoinRemoteHookUtility = <
  ERROR extends unknown = unknown,
  RESULT extends unknown = unknown,
  T extends unknown = unknown,
  STATE extends DefaultRootState = DefaultRootState
>(
  props: CoinRemoteHookUtilityProps<ERROR, RESULT, T, STATE>
) => RemoteHookState<ERROR, RESULT>
