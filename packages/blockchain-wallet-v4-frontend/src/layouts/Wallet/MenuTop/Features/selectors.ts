import { path, toUpper } from 'ramda'
import { createSelector } from 'reselect'

import { DEFAULT_INVITATIONS } from '@core/model'
import { selectors } from 'data'

export const getData = createSelector(
  [
    path<any>(['router', 'location', 'pathname']),
    selectors.core.settings.getInvitations,
    selectors.core.walletOptions.getFeatureFlags
  ],
  (pathname: string, invitationsR, featureFlagsR) => {
    const params = pathname.split('/')
    const coin = toUpper(params[1])
    return {
      coin,
      featureFlags: featureFlagsR.getOrElse({} as { [key in string]: boolean }),
      invitations: invitationsR.getOrElse(DEFAULT_INVITATIONS),
      lockboxDeviceId: params[3],
      lockboxPath: pathname.includes('lockbox'),
      pathname,
      requestAvailable: true,
      sendAvailable: true
    }
  }
)

export default getData
