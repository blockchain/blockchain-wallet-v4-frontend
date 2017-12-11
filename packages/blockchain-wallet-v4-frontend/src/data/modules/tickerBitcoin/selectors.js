import * as selectors from './../../selectors'
import { Exchange } from 'blockchain-wallet-v4/src'

export const getTickerBitcoin = (state) => {
  const currency = selectors.core.settings.getCurrency(state)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)

  return {
    rate: Exchange.displayBitcoinToFiat({ value: '1', fromUnit: 'BTC', toCurrency: currency, rates: bitcoinRates })
  }
}
