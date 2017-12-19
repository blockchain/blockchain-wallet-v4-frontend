import { Exchange, RemoteData } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getFiatDisplay = (state, coin, amount) => {
  const settings = selectors.core.settings.getSettings(state)
  const rates = coin === 'BTC'
    ? selectors.core.data.bitcoin.getRates(state)
    : selectors.core.data.ethereum.getRates(state)
  const test = RemoteData.concat(rates, settings)
  console.log('test', test)
  const convert = value => {
    console.log(coin, amount)
    return coin === 'BTC'
    ? Exchange.displayBitcoinToFiat({ value: amount, fromUnit: 'SAT', toCurrency: value[1].btc_currency, rates: value[0] })
    : Exchange.displayEtherToFiat({ value: amount, fromUnit: 'WEI', toCurrency: value[1].btc_currency, rates: value[0] })
  }

  return {
    value: RemoteData.map((coin, amount) => convert(coin, amount), test)
  }
  // switch (coin) {
  // case 'ETH': return ({
  //   value: Exchange.displayBitcoinToFiat({ value, fromUnit: 'WEI', toCurrency: currency, rates: ethereumRates }) || 'N/A'
  // })
  // default: return ({
  //   value: Exchange.displayBitcoinToFiat({ value, fromUnit: 'SAT', toCurrency: currency, rates: bitcoinRates }) || 'N/A'
  // })
  // }
}
