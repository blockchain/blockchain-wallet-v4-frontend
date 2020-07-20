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
    userKYCState
  ) => {
    const transform = (lockboxDevices, countryCode, invitations) => {
      return {
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
