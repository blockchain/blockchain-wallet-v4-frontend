import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.exchange.getCanTrade,
    selectors.router.getPathname
  ],
  (menuOpened, canTradeR, pathname) => {
    const canTrade = canTradeR.getOrElse(false)
    return { menuOpened, canTrade, pathname }
  }
)
