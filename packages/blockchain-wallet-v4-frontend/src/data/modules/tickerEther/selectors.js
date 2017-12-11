import * as selectors from './../../selectors'
import { Exchange } from 'blockchain-wallet-v4/src'

export const getTickerEther = (state) => {
  const currency = selectors.core.settings.getCurrency(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)

  return {
    rate: Exchange.displayEtherToFiat({ value: '1', fromUnit: 'ETH', toCurrency: currency, rates: ethereumRates })
  }
}
