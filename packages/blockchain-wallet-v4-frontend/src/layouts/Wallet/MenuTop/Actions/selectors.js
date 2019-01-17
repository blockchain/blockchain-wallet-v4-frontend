import { path, propOr, toUpper } from 'ramda'
import { createSelector } from 'reselect'

import { selectors } from 'data'

export const getData = createSelector(
  [
    path(['router', 'location', 'pathname']),
    state => selectors.core.walletOptions.getCoinAvailability(state)
  ],
  (pathname, getCoinAvailability) => {
    const params = pathname.split('/')
    const coin = params[1]
    const availability = getCoinAvailability(toUpper(coin))
    return {
      coin,
      sendAvailable: availability.map(propOr(true, 'send')).getOrElse(false),
      requestAvailable: availability
        .map(propOr(true, 'request'))
        .getOrElse(false),
      lockboxPath: pathname.includes('lockbox'),
      lockboxDeviceId: params[3],
      pathname
    }
  }
)
