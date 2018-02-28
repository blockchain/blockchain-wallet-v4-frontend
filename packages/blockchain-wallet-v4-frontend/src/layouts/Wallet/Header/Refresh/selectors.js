import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { join, lift } from 'ramda'

export const getData = (state) => {
  const bitcoinContext = Remote.of(join('|', selectors.core.wallet.getWalletContext(state)))
  const etherContext = selectors.core.kvStore.ethereum.getContext(state)
  const bchContext = Remote.of(join('|', selectors.core.wallet.getWalletContext(state)))
  const path = state.router.location.pathname
  const transform = lift((bitcoinContext, etherContext, bchContext) => ({bitcoinContext, etherContext, bchContext, path}))
  return transform(bitcoinContext, etherContext, bchContext)
}
