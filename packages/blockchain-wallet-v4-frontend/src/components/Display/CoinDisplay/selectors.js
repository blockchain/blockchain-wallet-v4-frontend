
import { Exchange, RemoteData } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, coin, amount) => {
  const settings = selectors.core.settings.getSettings(state)

  const convert = value => coin === 'BTC'
    ? Exchange.displayBitcoinToBitcoin({ value: amount, fromUnit: 'SAT', toUnit: value.btc_currency })
    : Exchange.displayEtherToEther({ value: amount, fromUnit: 'WEI', toUnit: 'ETH' })

  return {
    value: RemoteData.map((coin, amount) => convert(coin, amount), settings)
  }
}
