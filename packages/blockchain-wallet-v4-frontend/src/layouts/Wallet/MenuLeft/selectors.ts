import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.auth.getFirstLogin,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getDomains
  ],
  (
    menuOpened: boolean,
    firstLogin: boolean,
    pathname,
    lockboxDevicesR,
    countryCodeR,
    domainsR
  ) => {
    const transform = (
      countryCode,
      domains: ExtractSuccess<typeof domainsR>,
      lockboxDevices
    ) => {
      return {
        countryCode,
        domains,
        firstLogin,
        lockboxDevices,
        menuOpened,
        pathname
      }
    }

    return lift(transform)(countryCodeR, domainsR, lockboxDevicesR)
  }
)
