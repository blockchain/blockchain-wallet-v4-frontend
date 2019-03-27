import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift, prop, toLower } from 'ramda'

export const getData = (state, coin, amount) => {
  const currencyR = selectors.core.settings
    .getSettings(state)
    .map(prop('currency'))

  const getCoinRates = coin => {
    switch (coin) {
      case 'BCH':
        return selectors.core.data.bch.getRates(state)
      case 'BTC':
        return selectors.core.data.btc.getRates(state)
      case 'BSV':
        return selectors.core.data.bsv.getRates(state)
      case 'PAX':
        return selectors.core.data.eth.getErc20Rates(state, toLower(coin))
      case 'ETH':
        return selectors.core.data.eth.getRates(state)
      case 'XLM':
        return selectors.core.data.xlm.getRates(state)
      default:
        return Remote.Failure('Coin code incorrect')
    }
  }

  const ratesR = getCoinRates(coin)

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
      toCurrency: currency,
      rates
    })
  return lift(convert)(currencyR, ratesR)
}
