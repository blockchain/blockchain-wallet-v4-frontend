import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getUnspendableContext,
    selectors.core.wallet.getUnspendableContext,
    selectors.router.getPathname
  ],
  (bchUnspendableContext, btcUnspendableContext, path) => {
    return {
      bchUnspendableContext,
      btcUnspendableContext,
      path
    }
  }
)
