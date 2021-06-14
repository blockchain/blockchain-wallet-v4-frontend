import { Remote } from 'blockchain-wallet-v4/src'
import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { UnspentResponseType } from 'core/network/api/btc/types'
import { RootState } from 'data/rootReducer'

// eslint-disable-next-line
export const getSearchChainStatus = (
  state: RootState,
  coin: string
): RemoteDataType<
  string,
  {
    accountIndex: number
    badChange?: string[]
    coin: string
    data: UnspentResponseType['unspent_outputs']
    derivationType: string
  }
> => {
  const x = state.components.fundRecovery[coin]
    ? state.components.fundRecovery[coin]
    : Remote.NotAsked
  return x
}
