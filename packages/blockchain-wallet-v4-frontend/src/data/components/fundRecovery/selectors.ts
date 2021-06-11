import { Remote } from 'blockchain-wallet-v4/src'
import { UnspentResponseType } from 'blockchain-wallet-v4/src/network/api/btc/types'
import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

export const getSearchChainStatus = (
  state: RootState,
  coin: string
): RemoteDataType<string, { [key in string]: UnspentResponseType['unspent_outputs'] }> => {
  const x = state.components.fundRecovery.unspents[coin]
    ? state.components.fundRecovery.unspents[coin]
    : Remote.NotAsked
  return x
}
