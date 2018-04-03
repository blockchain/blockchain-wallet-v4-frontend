import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, coin) => {
  const settings = selectors.core.settings.getSettings(state)
  const getRates = (coin) => {
    switch (coin) {
      case 'BTC': return selectors.core.data.bitcoin.getRates(state)
      case 'ETH': return selectors.core.data.ethereum.getRates(state)
      default: return selectors.core.data.bch.getRates(state)
    }
  }

  const transform = (settings, rates) => Exchange.displayCoinToFiat({ fromCoin: coin, value: 1, fromUnit: coin, toCurrency: settings.currency, rates })
  return lift(transform)(settings, getRates(coin))
}
