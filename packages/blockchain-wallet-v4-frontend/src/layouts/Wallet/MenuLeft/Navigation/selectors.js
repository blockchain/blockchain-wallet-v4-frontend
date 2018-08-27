import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getSettingsOpened,
    selectors.exchange.getCanTrade,
    selectors.modules.profile.userFlowSupported,
    selectors.router.getPathname
  ],
  (menuOpened, settingsOpened, canTradeR, userFlowSupportedR, pathname) => {
    const canTrade = canTradeR.getOrElse(false)
    const userFlowSupported = userFlowSupportedR.getOrElse(false)
    return { menuOpened, settingsOpened, canTrade, userFlowSupported, pathname }
  }
)
