import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.auth.getFirstLogin,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.hasDeprecatedDevice,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getDomains
  ],
  (
    menuOpened: boolean,
    firstLogin: boolean,
    pathname,
    hasDeprecatedLockbox: boolean,
    countryCodeR,
    domainsR
  ) => {
    const transform = (countryCode, domains: ExtractSuccess<typeof domainsR>) => {
      return {
        countryCode,
        domains,
        firstLogin,
        hasDeprecatedLockbox,
        menuOpened,
        pathname
      }
    }

    return lift(transform)(countryCodeR, domainsR)
  }
)
