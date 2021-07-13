import { lift, prop } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { CoinTypeEnum, FiatTypeEnum } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (
  state,
  coinSymbol,
  amount,
  defaultCurrency,
  defaultRates
) => {
  const coin = coinSymbol === 'USD-D' ? 'PAX' : coinSymbol
  const currencyR = selectors.core.settings
    .getSettings(state)
    .map(prop('currency'))

  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)

  let value
  if (coin in CoinTypeEnum) {
    value = Exchange.convertCoinToCoin({
      value: amount,
      coin,
      baseToStandard: true
    }).value
  }

  const convert = (currency, rates) => {
    if (coin in FiatTypeEnum) {
      if (coin === currency)
        return fiatToString({ value: amount, unit: currency })

      value = Exchange.convertFiatToFiat({
        value: amount,
        fromCurrency: coin,
        toCurrency: currency,
        rates
      }).value
      return fiatToString({ value, unit: currency })
    }
    return Exchange.displayCoinToFiat({
      value,
      fromCoin: coin,
      fromUnit: coin,
      toCurrency: defaultCurrency || currency,
      rates: defaultRates || rates
    })
  }
  return lift(convert)(currencyR, ratesR)
}
