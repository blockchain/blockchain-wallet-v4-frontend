import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state) => {
  const settings = selectors.core.settings.getSettings(state)
  const rates = selectors.core.data.ethereum.getRates(state)
  const transform = (settings, rates) => Exchange.displayEtherToFiat({ value: 1, fromUnit: 'ETH', toCurrency: settings.currency, rates })
  return lift(transform)(settings, rates)
}
