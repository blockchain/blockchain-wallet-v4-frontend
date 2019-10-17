import { lift } from 'ramda'
import { model, selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const { AB_TESTS } = model.analytics

export const getData = createDeepEqualSelector(
  [
    selectors.analytics.selectAbTest(AB_TESTS.PIT_CONNECT_TEST),
    selectors.preferences.getShowThePitPulse,
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getLockboxOpened,
    selectors.components.onboarding.getWalletTourVisibility,
    selectors.auth.getFirstLogin,
    selectors.exchange.getCanTrade,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.kvStore.whatsNew.getHasSkippedTour,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getAdsBlacklist,
    selectors.core.walletOptions.getAdsUrl,
    selectors.modules.profile.getUserKYCState
  ],
  (
    pitConnectTest,
    showThePitPulse,
    menuOpened,
    lockboxOpened,
    walletTourVisibility,
    firstLogin,
    canTradeR,
    pathname,
    lockboxDevicesR,
    hasSkippedTourR,
    countryCodeR,
    adsBlacklistR,
    adsUrlR,
    userKYCState
  ) => {
    const transform = (
      pitConnectTest,
      canTrade,
      lockboxDevices,
      countryCode,
      userKYCState
    ) => {
      return {
        adsBlacklist: adsBlacklistR.getOrElse([]),
        adsUrl: adsUrlR.getOrElse(''),
        canTrade,
        countryCode,
        hasRunWalletTour: walletTourVisibility,
        hasSkippedTour: hasSkippedTourR.getOrElse(false),
        firstLogin,
        lockboxDevices,
        lockboxOpened,
        menuOpened,
        pathname,
        pitConnectTest,
        showThePitPulse,
        userKYCState
      }
    }

    return lift(transform)(
      pitConnectTest,
      canTradeR,
      lockboxDevicesR,
      countryCodeR,
      userKYCState
    )
  }
)
