import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const coinsR = selectors.components.utils.getCoinsWithMethodAndOrder(state)

  const transform = (coins: ExtractSuccess<typeof coinsR>) => {
    return coins
      .filter((val) => val.coinfig.products.includes('PrivateKey'))
      .map(({ coinfig }) => ({ text: coinfig.name, value: coinfig.symbol }))
  }

  return lift(transform)(coinsR)
}

export default getData
