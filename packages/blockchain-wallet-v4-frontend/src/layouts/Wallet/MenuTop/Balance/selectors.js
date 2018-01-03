import { RemoteData } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { join } from 'ramda'

export const getData = (state) => {
  const bitcoinContext = {
    status: 'Success',
    value: join('|', selectors.core.wallet.getWalletContext(state))
  }
  const etherContext = selectors.core.kvStore.ethereum.getContext(state)

  return {
    value: RemoteData.concat(bitcoinContext, etherContext)
  }
}
