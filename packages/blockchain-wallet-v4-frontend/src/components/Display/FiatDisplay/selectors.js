import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, coin, amount) => {
  const settings = selectors.core.settings.getSettings(state)
  const rates = coin === 'BTC'
    ? selectors.core.data.bitcoin.getRates(state)
    : selectors.core.data.ethereum.getRates(state)
  const convert = (s, r, c, a) => c === 'BTC'
    ? Exchange.displayBitcoinToFiat({ value: a, fromUnit: 'SAT', toCurrency: s.btc_currency, rates: r })
    : Exchange.displayEtherToFiat({ value: a, fromUnit: 'WEI', toCurrency: 'ETH', rates: r })
  return lift(convert)(settings, rates, Remote.of(coin), Remote.of(amount))
}
