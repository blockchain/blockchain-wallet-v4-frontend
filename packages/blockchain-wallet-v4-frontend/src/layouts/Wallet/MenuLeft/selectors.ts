import { createDeepEqualSelector } from 'services/ReselectHelper'
import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.utils.getSupportedCoinsWithBalanceAndOrder,
    selectors.auth.getFirstLogin,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getDomains
  ],
  (
    menuOpened: boolean,
    coinsR,
    firstLogin: boolean,
    pathname,
    lockboxDevicesR,
    countryCodeR,
    domainsR
  ) => {
    const transform = (
      coins: ExtractSuccess<typeof coinsR>,
      countryCode,
      domains: ExtractSuccess<typeof domainsR>,
      lockboxDevices
    ) => {
      return {
        coins,
        countryCode,
        domains,
        firstLogin,
        lockboxDevices,
        menuOpened,
        pathname
      }
    }

    return lift(transform)(coinsR, countryCodeR, domainsR, lockboxDevicesR)
  }
)
