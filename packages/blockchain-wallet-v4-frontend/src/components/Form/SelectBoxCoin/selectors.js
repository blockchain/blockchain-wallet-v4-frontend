import { map, prop, values } from 'ramda'

import { selectors } from 'data'

export const getCoins = (state, { type }) => {
  const supportedCoins = selectors.components.utils
    .getSupportedCoinsWithMethodAndOrder(state)
    .getOrElse({})

  return values(
    map((x) => ({ text: x.coinfig.name, value: x.coinfig.symbol }), supportedCoins)
  ).filter(
    ({ value }) =>
      selectors.core.walletOptions
        .getCoinAvailability(state, value)
        .map(prop(type))
        .getOrElse(false) || window.coins[value].coinfig.type.erc20Address
  )
}

export default getCoins
