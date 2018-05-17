import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { join, lift } from 'ramda'

export const getData = (state) => {
  const btcContext = selectors.core.wallet.getWalletContext(state)
  const ethContext = selectors.core.kvStore.ethereum.getContext(state)
  const bchContext = Remote.of(selectors.core.kvStore.bch.getContext(state, btcContext))
  const btcContextR = Remote.of(join('|', btcContext))
  const path = state.router.location.pathname
  const transform = lift((btcContextR, ethContext, bchContext) => ({btcContext, ethContext, bchContext, path}))
  return transform(btcContextR, ethContext, bchContext)
}
