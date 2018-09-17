import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getLockboxOpened,
    selectors.exchange.getCanTrade,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices
  ],
  (menuOpened, lockboxOpened, canTradeR, pathname, lockboxDevicesR) => {
    const canTrade = canTradeR.getOrElse(false)
    const lockboxDevices = lockboxDevicesR.getOrElse([])
    return { menuOpened, lockboxOpened, canTrade, pathname, lockboxDevices }
  }
)
