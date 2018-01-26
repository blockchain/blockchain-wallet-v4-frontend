import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state) => {
  const settings = selectors.core.settings.getSettings(state)
  const rates = selectors.core.data.bitcoin.getRates(state)
  const transform = (settings, rates) => Exchange.displayBitcoinToFiat({ value: 1, fromUnit: 'BTC', toCurrency: settings.currency, rates })
  return lift(transform)(settings, rates)
}
