import * as selectors from './../../selectors'
import { Exchange } from 'blockchain-wallet-v4/src'

export const getFiatDisplay = (state, coin, value) => {
  const currency = selectors.core.settings.getCurrency(state)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)

  switch (coin) {
    case 'ETH': return ({
      value: Exchange.displayBitcoinToFiat({ value, fromUnit: 'WEI', toCurrency: currency, rates: ethereumRates }) || 'N/A'
    })
    default: return ({
      value: Exchange.displayBitcoinToFiat({ value, fromUnit: 'SAT', toCurrency: currency, rates: bitcoinRates }) || 'N/A'
    })
  }
}
