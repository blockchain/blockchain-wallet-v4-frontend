import { Exchange, RemoteData } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getFiatDisplay = (state, coin, amount) => {
  const settings = selectors.core.settings.getSettings(state)
  const rates = coin === 'BTC'
    ? selectors.core.data.bitcoin.getRates(state)
    : selectors.core.data.ethereum.getRates(state)

  const data = RemoteData.concat(rates, settings)

  const convert = value => {
    return coin === 'BTC'
    ? Exchange.displayBitcoinToFiat({ value: amount, fromUnit: 'SAT', toCurrency: value[1].btc_currency, rates: value[0] })
    : Exchange.displayEtherToFiat({ value: amount, fromUnit: 'WEI', toCurrency: 'ETH', rates: value[0] })
  }

  return {
    value: RemoteData.map((coin, amount) => convert(coin, amount), data)
  }
}
