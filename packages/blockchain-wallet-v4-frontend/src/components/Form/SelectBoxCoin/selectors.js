import { map, prop, reject, values } from 'ramda'

import { selectors } from 'data'

export const getCoins = (state, { type }) => {
  const supportedCoins = selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
  const coinOrder = ['PAX', 'BTC', 'BCH', 'ETH', 'XLM']
  return values(
    map(
      x => ({ text: x.displayName, value: x.coinCode }),
      reject(c => !c.invited, supportedCoins)
    )
  )
    .filter(({ value }) =>
      selectors.core.walletOptions
        .getCoinAvailability(state, value)
        .map(prop(type))
        .getOrElse(false)
    )
    .sort((a, b) => coinOrder.indexOf(a.value) - coinOrder.indexOf(b.value))
}
