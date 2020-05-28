import { createSelector } from 'reselect'
import { path, propOr, toUpper } from 'ramda'

import { selectors } from 'data'

export const getData = createSelector(
  [
    path<any>(['router', 'location', 'pathname']),
    state => selectors.core.walletOptions.getCoinAvailability(state),
    state => selectors.core.walletOptions.getErc20CoinList(state),
    state => selectors.core.walletOptions.getSupportedCoins(state),
    state => selectors.core.settings.getInvitations(state)
  ],
  (
    pathname: string,
    getCoinAvailability,
    erc20ListR,
    supportedCoinsR,
    invitationsR
  ) => {
    const params = pathname.split('/')
    let coin = toUpper(params[1])
    // hack to support PAX rebrand 🤬
    if (coin === 'USD-D') coin = 'PAX'
    const availability = getCoinAvailability(coin)
    return {
      coin: coin,
      erc20List: erc20ListR.getOrFail(),
      invitations: invitationsR.getOrElse({}),
      supportedCoins: supportedCoinsR.getOrFail(),
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
