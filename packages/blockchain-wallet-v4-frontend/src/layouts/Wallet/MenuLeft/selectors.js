import { lift } from 'ramda'
import { model, selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const { AB_TESTS } = model.analytics

export const getData = createDeepEqualSelector(
  [
    selectors.analytics.selectAbTest(AB_TESTS.PIT_SIDE_NAV_TEST2),
    selectors.preferences.getShowThePitPulse,
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getLockboxOpened,
    selectors.auth.getFirstLogin,
    selectors.exchange.getCanTrade,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getAdsBlacklist,
    selectors.core.walletOptions.getAdsUrl
  ],
  (
    pitSideNavTest2R,
    showThePitPulse,
    menuOpened,
    lockboxOpened,
    firstLogin,
    canTradeR,
    pathname,
    lockboxDevicesR,
    countryCodeR,
    adsBlacklistR,
    adsUrlR
  ) => {
    const transform = (
      pitSideNavTest2,
      canTrade,
      lockboxDevices,
      countryCode
    ) => {
      return {
        adsBlacklist: adsBlacklistR.getOrElse([]),
        adsUrl: adsUrlR.getOrElse(''),
        canTrade,
        countryCode,
        firstLogin,
        lockboxDevices,
        lockboxOpened,
        menuOpened,
        pathname,
        pitSideNavTest2,
        showThePitPulse
      }
    }

    return lift(transform)(
      pitSideNavTest2R,
      canTradeR,
      lockboxDevicesR,
      countryCodeR
    )
  }
)
