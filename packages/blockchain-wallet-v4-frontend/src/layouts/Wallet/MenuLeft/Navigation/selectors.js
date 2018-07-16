import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getSettingsOpened,
    selectors.exchange.getCanTrade,
    selectors.router.getPathname
  ],
  (menuOpened, settingsOpened, canTradeR, pathname) => {
    const canTrade = canTradeR.getOrElse(false)
    return { menuOpened, settingsOpened, canTrade, pathname }
  }
)
