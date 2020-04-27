import { createSelector } from 'reselect'
import { path, propOr, toUpper } from 'ramda'

import { selectors } from 'data'

export const getData = createSelector(
  [
    path(['router', 'location', 'pathname']),
    state => selectors.core.walletOptions.getCoinAvailability(state),
    state => selectors.core.walletOptions.getErc20CoinList(state),
    state => selectors.core.walletOptions.getSupportedCoins(state)
  ],
  (pathname, getCoinAvailability, erc20ListR, supportedCoinsR) => {
    const params = pathname.split('/')
    let coin = toUpper(params[1])
    // hack to support PAX rebrand 🤬
    if (coin === 'USD-D') coin = 'PAX'
    const availability = getCoinAvailability(coin)
    return {
      coin: coin,
      erc20List: erc20ListR.getOrFail(),
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
