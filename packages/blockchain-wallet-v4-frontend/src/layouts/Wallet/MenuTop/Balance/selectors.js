import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.router.getPathname,
    selectors.core.walletOptions.getSupportedCoins
  ],
  (path, supportCoinsR) => ({
    path,
    supportCoins: supportCoinsR.getOrElse({})
  })
)
