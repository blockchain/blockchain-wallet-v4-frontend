import { lift } from 'ramda'
import { model, selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const { AB_TESTS } = model.analytics

export const getData = createDeepEqualSelector(
  [
    selectors.analytics.selectAbTest(AB_TESTS.SWAP_OR_TRADE_TEST),
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getLockboxOpened,
    selectors.exchange.getCanTrade,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices
  ],
  (
    swapOrTradeTestR,
    menuOpened,
    lockboxOpened,
    canTradeR,
    pathname,
    lockboxDevicesR
  ) => {
    const transform = (swapOrTrade, canTrade, lockboxDevices) => {
      return {
        swapOrTrade,
        canTrade,
        pathname,
        menuOpened,
        lockboxOpened,
        lockboxDevices
      }
    }

    return lift(transform)(swapOrTradeTestR, canTradeR, lockboxDevicesR)
  }
)
