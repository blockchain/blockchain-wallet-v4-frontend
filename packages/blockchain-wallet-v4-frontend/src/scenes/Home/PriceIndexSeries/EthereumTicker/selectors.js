import { Exchange, RemoteData } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state) => {
  const settings = selectors.core.settings.getSettings(state)
  const rates = selectors.core.data.ethereum.getRates(state)
  const data = RemoteData.concat(settings, rates)
  const convert = value => Exchange.displayEtherToFiat({ value: 1, fromUnit: 'ETH', toCurrency: value[0].currency, rates: value[1] })

  return {
    value: RemoteData.map(convert, data)
  }
}
