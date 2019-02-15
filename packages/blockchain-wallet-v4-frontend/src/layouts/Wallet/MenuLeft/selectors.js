import { lift } from 'ramda'
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
    const transform = (canTrade, lockboxDevices) => {
      return {
        canTrade,
        pathname,
        menuOpened,
        lockboxOpened,
        lockboxDevices
      }
    }

    return lift(transform)(canTradeR, lockboxDevicesR)
  }
)
