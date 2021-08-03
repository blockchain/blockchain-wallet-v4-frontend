import { Remote } from 'blockchain-wallet-v4/src'
import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

import * as A from './actions'

export const getSearchChainStatus = (
  state: RootState,
  coin: string
): RemoteDataType<string, ReturnType<typeof A.searchChainSuccess>['payload']> => {
  return state.components.fundRecovery[coin]
    ? state.components.fundRecovery[coin].chainSearch
    : Remote.NotAsked
}

export const getFundRecoveryStatus = (state: RootState, coin: string) => {
  return state.components.fundRecovery[coin]
    ? state.components.fundRecovery[coin].fundRecoveryStatus
    : Remote.NotAsked
}
