import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.wallet.getWalletContext,
    selectors.core.kvStore.bch.getContext,
    selectors.core.kvStore.ethereum.getContext,
    selectors.router.getPathname
  ],
  (btcContext, bchContext, ethContextR, path) => {
    const transform = (ethContext) => ({
      btcContext,
      ethContext,
      bchContext,
      path
    })
    return ethContextR.map(transform)
  }
)
