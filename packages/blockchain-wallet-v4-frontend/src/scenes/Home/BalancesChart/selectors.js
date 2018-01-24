import { selectors } from 'data'
import { lift } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { Color } from 'blockchain-info-components'

export const getData = (state) => {
  const bitcoinBalance = selectors.core.data.bitcoin.getBalance(state)
  const etherBalance = selectors.core.data.ethereum.getBalance(state)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)
  const settings = selectors.core.settings.getSettings(state)

  const transform = (bitcoinBalance, etherBalance, bitcoinRates, ethereumRates, settings) => {
    const bitcoinFiatBalance = Exchange.convertBitcoinToFiat({ value: bitcoinBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bitcoinRates })
    const etherFiatBalance = Exchange.convertEtherToFiat({ value: etherBalance, fromUnit: 'WEI', toCurrency: settings.currency, rates: ethereumRates })

    const categories = ['Bitcoin', 'Ether', 'Bitcoin Cash']
    const data = [{
      y: Number(bitcoinFiatBalance.value),
      color: Color('brand-primary')
    }, {
      y: Number(etherFiatBalance.value),
      color: Color('brand-secondary')
    }, {
      y: 0,
      color: Color('brand-tertiary')
    }]
    const chartData = []
    const dataLen = data.length

    // Build the data arrays
    for (var i = 0; i < dataLen; i += 1) {
      // add coin data
      chartData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color
      })
    }

    return ({ bitcoinBalance, etherBalance, chartData })
  }

  return lift(transform)(bitcoinBalance, etherBalance, bitcoinRates, ethereumRates, settings)
}
