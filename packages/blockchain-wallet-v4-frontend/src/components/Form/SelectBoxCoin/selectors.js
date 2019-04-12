import { map, prop, reject, values } from 'ramda'

import { selectors } from 'data'

// TODO: better way to exclude BSV via model
export const getCoins = (state, { type }) => {
  const supportedCoins = selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
  return values(
    map(
      x => ({ text: x.displayName, value: x.coinCode }),
      reject(c => c.coinCode === 'BSV', supportedCoins)
    )
  ).filter(({ value }) =>
    selectors.core.walletOptions
      .getCoinAvailability(state, value)
      .map(prop(type))
      .getOrElse(false)
  )
}
