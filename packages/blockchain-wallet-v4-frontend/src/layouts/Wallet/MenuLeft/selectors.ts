import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.auth.getFirstLogin,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getDomains,
    selectors.modules.profile.getUserData,
    selectors.core.walletOptions.getWithdrawalLocksFundsOnHold
  ],
  (
    menuOpened: boolean,
    firstLogin: boolean,
    pathname,
    lockboxDevicesR,
    countryCodeR,
    domainsR,
    userDataR,
    withdrawalLocksFundsOnHoldR
  ) => {
    const transform = (
      countryCode,
      domains: ExtractSuccess<typeof domainsR>,
      lockboxDevices,
      userData: ExtractSuccess<typeof userDataR>
    ) => {
      return {
        countryCode,
        domains,
        firstLogin,
        lockboxDevices,
        menuOpened,
        pathname,
        userData,
        withdrawalLocksFundsOnHold: withdrawalLocksFundsOnHoldR.getOrElse(false)
      }
    }

    return lift(transform)(countryCodeR, domainsR, lockboxDevicesR, userDataR)
  }
)
