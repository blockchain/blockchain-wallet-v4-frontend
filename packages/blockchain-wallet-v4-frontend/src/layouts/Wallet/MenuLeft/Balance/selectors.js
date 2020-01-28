import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.router.getPathname,
    selectors.core.walletOptions.getSupportedCoins
  ],
  (path, supportedCoinsR) => ({
    path,
    supportedCoins: supportedCoinsR.getOrElse({})
  })
)
