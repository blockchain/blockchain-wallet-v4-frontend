import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { join, lift } from 'ramda'

export const getData = (state) => {
  const bitcoinContext = Remote.of(join('|', selectors.core.wallet.getWalletContext(state)))
  const etherContext = selectors.core.kvStore.ethereum.getContext(state)
  const transform = lift((bitcoinContext, etherContext) => ({bitcoinContext, etherContext}))
  return transform(bitcoinContext, etherContext)
}
