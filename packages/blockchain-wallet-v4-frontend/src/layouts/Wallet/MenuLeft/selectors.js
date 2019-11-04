import { lift } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { STATUS } from 'react-joyride/lib'

export const getData = createDeepEqualSelector(
  [
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
    const transform = (canTrade, lockboxDevices, countryCode) => {
      return {
        adsBlacklist: adsBlacklistR.getOrElse([]),
        adsUrl: adsUrlR.getOrElse(''),
        canTrade,
        countryCode,
        hasRunWalletTour: walletTourVisibility === STATUS.FINISHED,
        hasSkippedTour: hasSkippedTourR.getOrElse(false),
        firstLogin,
        lockboxDevices,
        lockboxOpened,
        menuOpened,
        pathname,
        showThePitPulse,
        userKYCState: userKYCState.getOrElse(null)
      }
    }

    return lift(transform)(canTradeR, lockboxDevicesR, countryCodeR)
  }
)
