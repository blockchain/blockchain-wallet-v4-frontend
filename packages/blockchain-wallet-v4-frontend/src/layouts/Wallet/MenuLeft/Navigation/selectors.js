import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getSettingsOpened,
    selectors.exchange.getCanTrade,
    selectors.router.getPathname
  ],
  (menuOpened, settingsOpened, canTrade, pathname) => {
    const canBuy = Remote.Success.is(canTrade)
    return { menuOpened, settingsOpened, canBuy, pathname }
  }
)
