import { lift } from 'ramda'

import { Exchange } from '@core'

import * as selectors from '../../selectors'

export const getData = (state, coin) => {
  const ratesR = selectors.core.data.coins.getRates(coin, state)
  const currencyR = selectors.core.settings.getCurrency(state)

  const transform = (rates, currency) => {
    return {
      coin: `1 ${coin}`,
      fiat: Exchange.displayCoinToFiat({
        rates,
        toCurrency: currency,
        value: 1
      })
    }
  }

  return lift(transform)(ratesR, currencyR)
}

export default getData
