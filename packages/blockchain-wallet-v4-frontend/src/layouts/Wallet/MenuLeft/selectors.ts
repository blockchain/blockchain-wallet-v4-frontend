import { createDeepEqualSelector } from 'services/ReselectHelper'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getLockboxOpened,
    selectors.auth.getFirstLogin,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.settings.getCountryCode,
    selectors.core.settings.getInvitations,
    selectors.core.walletOptions.getAdsBlacklist,
    selectors.core.walletOptions.getAdsUrl,
    selectors.modules.profile.getUserKYCState
  ],
  (
    menuOpened,
    lockboxOpened,
    firstLogin,
    pathname,
    lockboxDevicesR,
    countryCodeR,
    invitationsR,
    adsBlacklistR,
    adsUrlR,
    userKYCState
  ) => {
    const transform = (lockboxDevices, countryCode, invitations) => {
      return {
        adsBlacklist: adsBlacklistR.getOrElse([]),
        adsUrl: adsUrlR.getOrElse(''),
        countryCode,
        invitations,
        firstLogin,
        lockboxDevices,
        lockboxOpened,
        menuOpened,
        pathname,
        userKYCState: userKYCState.getOrElse(null)
      }
    }

    return lift(transform)(lockboxDevicesR, countryCodeR, invitationsR)
  }
)
