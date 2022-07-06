import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.signup.getFirstLogin,
    selectors.router.getPathname,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getDomains,
    selectors.modules.profile.getUserData
  ],
  (menuOpened: boolean, firstLogin: boolean, pathname, countryCodeR, domainsR, userDataR) => {
    const transform = (
      countryCode,
      domains: ExtractSuccess<typeof domainsR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => {
      return {
        countryCode,
        domains,
        firstLogin,
        menuOpened,
        pathname,
        userData
      }
    }

    return lift(transform)(countryCodeR, domainsR, userDataR)
  }
)
