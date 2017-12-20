import { Exchange, RemoteData } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state) => {
  const settings = selectors.core.settings.getSettings(state)
  const rates = selectors.core.data.bitcoin.getRates(state)
  const data = RemoteData.concat(settings, rates)
  const convert = value => Exchange.displayBitcoinToFiat({ value: 1, fromUnit: 'BTC', toCurrency: value[0].currency, rates: value[1] })

  return {
    value: RemoteData.map(convert, data)
  }
}
