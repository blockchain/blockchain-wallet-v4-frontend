import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state) => {
  const btcHDAccountContext = selectors.core.wallet.getHDAccounts(state)
  const ethContextR = selectors.core.kvStore.ethereum.getContext(state)
  const btcContextR = Remote.of(selectors.core.wallet.getWalletContext(state))
  const bchContextR = Remote.of(selectors.core.kvStore.bch.getContext(state, btcHDAccountContext))

  const path = state.router.location.pathname
  const transform = lift((btcContext, ethContext, bchContext) => ({btcContext, ethContext, bchContext, path}))
  return transform(btcContextR, ethContextR, bchContextR)
}
