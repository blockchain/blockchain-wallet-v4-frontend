import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.wallet.getSpendableContext,
    selectors.core.kvStore.bch.getSpendableContext,
    selectors.core.kvStore.ethereum.getContext,
    selectors.core.kvStore.bch.getUnspendableContext,
    selectors.core.wallet.getUnspendableContext,
    selectors.router.getPathname
  ],
  (btcContext, bchContext, ethContextR, bchUnspendableContext, btcUnspendableContext, path) => {
    const transform = (ethContext) => ({
      btcContext,
      ethContext,
      bchContext,
      btcUnspendableContext,
      path
    })
    return ethContextR.map(transform)
  }
)
