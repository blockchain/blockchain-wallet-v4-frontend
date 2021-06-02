import { path, propOr, toUpper } from 'ramda'
import { createSelector } from 'reselect'

import { DEFAULT_INVITATIONS } from 'blockchain-wallet-v4/src/model'
import { SupportedWalletCurrenciesType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = createSelector(
  [
    path<any>(['router', 'location', 'pathname']),
    (state) => selectors.core.walletOptions.getSupportedCoins(state),
    (state) => selectors.core.settings.getInvitations(state)
  ],
  (pathname: string, supportedCoinsR, invitationsR) => {
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
      supportedCoins: supportedCoinsR.getOrElse({} as SupportedWalletCurrenciesType)
    }
  }
)

export default getData
