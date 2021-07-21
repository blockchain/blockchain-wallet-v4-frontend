import { lift, prop } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { selectors } from 'data'

export const getData = (state, coin, amount, defaultCurrency, defaultRates) => {
  const currencyR = selectors.core.settings.getSettings(state).map(prop('currency'))
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)

  const { coinfig } = window.coins[coin]

  let value
  if (!coinfig.type.isFiat) {
    value = Exchange.convertCoinToCoin({
      coin,
      value: amount
    })
  }

  const convert = (currency, rates) => {
    if (coinfig.type.isFiat) {
      if (coin === currency) return fiatToString({ unit: currency, value: amount })

      value = Exchange.convertFiatToFiat({
        fromCurrency: coin,
        rates,
        toCurrency: currency,
        value: amount
      })
      return fiatToString({ unit: currency, value })
    }
    return Exchange.displayCoinToFiat({
      rates: defaultRates || rates,
      toCurrency: defaultCurrency || currency,
      value
    })
  }
  return lift(convert)(currencyR, ratesR)
}

export default getData
