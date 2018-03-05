import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, coin) => {
  const settings = selectors.core.settings.getSettings(state)
  const rates = coin === 'BTC'
    ? selectors.core.data.bitcoin.getRates(state)
    : coin === 'ETH' ? selectors.core.data.ethereum.getRates(state)
      : selectors.core.data.bch.getRates(state)
  const transform = (settings, rates) => Exchange.displayCoinToFiat({ fromCoin: coin, value: 1, fromUnit: coin, toCurrency: settings.currency, rates })
  return lift(transform)(settings, rates)
}
