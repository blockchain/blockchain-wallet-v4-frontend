import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { join, lift } from 'ramda'

export const getData = (state) => {
  const ethContext = selectors.core.kvStore.ethereum.getContext(state)
  const btcContext = Remote.of(join('|', selectors.core.wallet.getWalletContext(state)))
  const bchContext = Remote.of(join('|', selectors.core.wallet.getWalletContext(state)))
  const path = state.router.location.pathname
  const transform = lift((btcContext, ethContext, bchContext) => ({btcContext, ethContext, bchContext, path}))
  return transform(btcContext, ethContext, bchContext)
}
