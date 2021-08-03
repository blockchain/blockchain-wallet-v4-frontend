import { path, toUpper } from 'ramda'
import { createSelector } from 'reselect'

import { DEFAULT_INVITATIONS } from 'blockchain-wallet-v4/src/model'
import { selectors } from 'data'

export const getData = createSelector(
  [
    path<any>(['router', 'location', 'pathname']),
    (state) => selectors.core.settings.getInvitations(state)
  ],
  (pathname: string, invitationsR) => {
    const params = pathname.split('/')
    const coin = toUpper(params[1])
    return {
      coin,
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
