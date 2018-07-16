import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, coin, amount) => {
  const settings = selectors.core.settings.getSettings(state)

  const getCoinRates = (coin) => {
    switch (coin) {
      case 'BTC': return selectors.core.data.bitcoin.getRates(state)
      case 'ETH': return selectors.core.data.ethereum.getRates(state)
      case 'BCH': return selectors.core.data.bch.getRates(state)
      default: return Remote.Failure('Coin code incorrect')
    }
  }

  const rates = getCoinRates(coin)

  const convert = (s, r, c, a) => {
    switch (c) {
      case 'BTC': return Exchange.displayBitcoinToFiat({ value: a, fromUnit: 'SAT', toCurrency: s.currency, rates: r })
      case 'ETH': return Exchange.displayEtherToFiat({ value: a, fromUnit: 'WEI', toCurrency: s.currency, rates: r })
      case 'BCH': return Exchange.displayBchToFiat({ value: a, fromUnit: 'SAT', toCurrency: s.currency, rates: r })
      default: return 'N/A'
    }
  }
  return lift(convert)(settings, rates, Remote.of(coin), Remote.of(amount))
}
