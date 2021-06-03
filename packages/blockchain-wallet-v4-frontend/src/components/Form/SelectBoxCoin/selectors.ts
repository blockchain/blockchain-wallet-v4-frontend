import { map, values } from 'ramda'

import { selectors } from 'data'

export const getCoins = (state) => {
  const supportedCoins = selectors.components.utils
    .getSupportedCoinsWithMethodAndOrder(state)
    // @ts-ignore
    .getOrElse({})

  return values(map((x) => ({ text: x.coinfig.name, value: x.coinfig.symbol }), supportedCoins))
}

export default getCoins
