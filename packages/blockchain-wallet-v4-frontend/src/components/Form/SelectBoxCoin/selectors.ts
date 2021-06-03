import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const supportedCoinsR = selectors.components.utils.getSupportedCoinsWithMethodAndOrder(state)

  const transform = (supportedCoins: ExtractSuccess<typeof supportedCoinsR>) => {
    return supportedCoins
      .filter((val) => val.coinfig.products.includes('PrivateKey'))
      .map(({ coinfig }) => ({ text: coinfig.name, value: coinfig.symbol }))
  }

  return lift(transform)(supportedCoinsR)
}

export default getData
