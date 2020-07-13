import { Exchange } from 'blockchain-wallet-v4/src'
import { lift, prop } from 'ramda'
import { selectors } from 'data'

export const getData = (
  state,
  coinSymbol,
  amount,
  defaultCurrency,
  defaultRates
) => {
  const coin = coinSymbol === 'USD-D' ? 'PAX' : coinSymbol
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)
  const currencyR = selectors.core.settings
    .getSettings(state)
    .map(prop('currency'))
  const { value } = Exchange.convertCoinToCoin({
    value: amount,
    coin,
    baseToStandard: true
  })
  const convert = (currency, rates) =>
    Exchange.displayCoinToFiat({
      fromCoin: coin,
      fromUnit: coin,
      toCurrency: defaultCurrency || currency,
      rates: defaultRates || rates,
      value
    })
  return lift(convert)(currencyR, ratesR)
}
