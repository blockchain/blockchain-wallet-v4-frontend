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
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getAdsBlacklist,
    selectors.core.walletOptions.getAdsUrl
  ],
  (
    swapOrTradeTestR,
    menuOpened,
    lockboxOpened,
    canTradeR,
    pathname,
    lockboxDevicesR,
    countryCodeR,
    adsBlacklistR,
    adsUrlR
  ) => {
    const transform = (swapOrTrade, canTrade, lockboxDevices, countryCode) => {
      return {
        swapOrTrade,
        canTrade,
        pathname,
        menuOpened,
        lockboxOpened,
        lockboxDevices,
        countryCode,
        adsBlacklist: adsBlacklistR.getOrElse([]),
        adsUrl: adsUrlR.getOrElse('')
      }
    }

    return lift(transform)(
      swapOrTradeTestR,
      canTradeR,
      lockboxDevicesR,
      countryCodeR
    )
  }
)
