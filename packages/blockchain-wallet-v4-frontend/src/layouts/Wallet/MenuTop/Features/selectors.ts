import { path, toUpper } from 'ramda'
import { createSelector } from 'reselect'

import { DEFAULT_INVITATIONS } from '@core/model'
import { selectors } from 'data'

export const getData = createSelector(
  [
    path<any>(['router', 'location', 'pathname']),
    selectors.core.settings.getInvitations,
    selectors.core.walletOptions.getWalletConnectEnabled
  ],
  (pathname: string, invitationsR, walletConnectEnabledR) => {
    const params = pathname.split('/')
    const coin = toUpper(params[1])
    return {
      coin,
      invitations: invitationsR.getOrElse(DEFAULT_INVITATIONS),
      lockboxDeviceId: params[3],
      lockboxPath: pathname.includes('lockbox'),
      pathname,
      requestAvailable: true,
      sendAvailable: true,
      walletConnectEnabled: walletConnectEnabledR.getOrElse(false) as boolean
    }
  }
)

export default getData
