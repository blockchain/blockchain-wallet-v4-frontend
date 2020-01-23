import { Exchange } from 'blockchain-wallet-v4/src'
import { includes, lift, prop, toLower } from 'ramda'
import { selectors } from 'data'

export const getData = (state, coin, amount, defaultCurrency) => {
  const coinLower = toLower(coin)
  const currencyR = selectors.core.settings
    .getSettings(state)
    .map(prop('currency'))
  const erc20List = selectors.core.walletOptions
    .getErc20CoinList(state)
    .getOrFail()

  const getCoinRates = coin => {
    if (includes(coin, erc20List)) {
      return selectors.core.data.eth.getErc20Rates(state, coinLower)
    }
    return selectors.core.data[coinLower].getRates(state)
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
      toCurrency: defaultCurrency || currency,
      rates
    })
  return lift(convert)(currencyR, ratesR)
}
