import { Exchange } from 'blockchain-wallet-v4/src'
import { lift, prop } from 'ramda'
import { selectors } from 'data'

export const getData = (state, coin, amount, defaultCurrency, defaultRates) => {
  const currencyR = selectors.core.settings
    .getSettings(state)
    .map(prop('currency'))

  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)

  const { value } = Exchange.convertCoinToCoin({
    value: amount,
    coin,
    baseToStandard: true
  })

  const convert = (currency, rates) =>
    Exchange.displayCoinToFiat({
      value,
      fromCoin: coin,
      fromUnit: coin,
      toCurrency: defaultCurrency || currency,
      rates: defaultRates || rates
    })
  return lift(convert)(currencyR, ratesR)
}
