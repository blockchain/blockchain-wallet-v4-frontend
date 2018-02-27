import { selectors } from 'data'
import { lift } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { Color } from 'blockchain-info-components'

export const getData = (state) => {
  const bitcoinBalanceR = selectors.core.data.bitcoin.getBalance(state)
  const etherBalanceR = selectors.core.data.ethereum.getBalance(state)
  const bchBalanceR = selectors.core.data.bch.getBalance(state)
  const bitcoinBalance = bitcoinBalanceR.getOrElse(0)
  const etherBalance = etherBalanceR.getOrElse(0)
  const bchBalance = bchBalanceR.getOrElse(0)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)
  const bchRates = selectors.core.data.bch.getRates(state)
  const settings = selectors.core.settings.getSettings(state)

  const btcAccountsLength = selectors.core.common.bitcoin.getActiveHDAccounts(state).getOrElse([]).length
  const bchAccountsLength = selectors.core.kvStore.bch.getAccounts(state).getOrElse([]).length

  const transform = (bitcoinRates, ethereumRates, bchRates, settings) => {
    const bitcoinFiatBalance = Exchange.convertBitcoinToFiat({ value: bitcoinBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bitcoinRates })
    const etherFiatBalance = Exchange.convertEtherToFiat({ value: etherBalance, fromUnit: 'WEI', toCurrency: settings.currency, rates: ethereumRates })
    const bchFiatBalance = Exchange.convertBchToFiat({ value: bchBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bchRates })

    const categories = ['Bitcoin', 'Ether', 'Bitcoin Cash']
    const data = [{
      y: Number(bitcoinFiatBalance.value),
      color: Color('brand-primary'),
      id: 'btc'
    }, {
      y: Number(etherFiatBalance.value),
      color: Color('brand-secondary'),
      id: 'eth'
    }, {
      y: Number(bchFiatBalance.value),
      color: Color('brand-tertiary'),
      id: 'bch'
    }]
    const chartData = []
    const dataLen = data.length

    // Build the data arrays
    for (var i = 0; i < dataLen; i += 1) {
      // add coin data
      chartData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color,
        id: data[i].id
      })
    }

    return ({ bitcoinBalance, etherBalance, bchBalance, chartData, symbol: bitcoinFiatBalance.unit.symbol, btcAccountsLength, bchAccountsLength })
  }

  return lift(transform)(bitcoinRates, ethereumRates, bchRates, settings)
}
