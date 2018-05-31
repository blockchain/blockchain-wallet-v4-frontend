import { selectors } from 'data'
import { length, lift } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { Color } from 'blockchain-info-components'

export const getData = (state) => {
  const btcBalanceR = selectors.core.data.bitcoin.getSpendableBalance(state)
  const ethBalanceR = selectors.core.data.ethereum.getBalance(state)
  const bchBalanceR = selectors.core.data.bch.getBalance(state)
  const btcBalance = btcBalanceR.getOrElse(0)
  const ethBalance = ethBalanceR.getOrElse(0)
  const bchBalance = bchBalanceR.getOrElse(0)
  const btcRates = selectors.core.data.bitcoin.getRates(state)
  const ethRates = selectors.core.data.ethereum.getRates(state)
  const bchRates = selectors.core.data.bch.getRates(state)
  const settings = selectors.core.settings.getSettings(state)

  const btcAccountsLength = length(selectors.core.common.btc.getActiveHDAccounts(state).getOrElse([]))
  const bchAccountsLength = length(selectors.core.kvStore.bch.getAccounts(state).getOrElse([]))

  const transform = (btcRates, ethRates, bchRates, settings) => {
    const btcFiatBalance = Exchange.convertBitcoinToFiat({ value: btcBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: btcRates })
    const ethFiatBalance = Exchange.convertEtherToFiat({ value: ethBalance, fromUnit: 'WEI', toCurrency: settings.currency, rates: ethRates })
    const bchFiatBalance = Exchange.convertBchToFiat({ value: bchBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bchRates })

    const chartData = [{
      y: Number(btcFiatBalance.value),
      color: Color('brand-primary'),
      fiat: btcFiatBalance.value,
      name: 'Bitcoin',
      id: 'btc'
    }, {
      y: Number(ethFiatBalance.value),
      color: Color('brand-secondary'),
      fiat: ethFiatBalance.value,
      name: 'Ether',
      id: 'eth'
    }, {
      y: Number(bchFiatBalance.value),
      color: Color('brand-tertiary'),
      fiat: bchFiatBalance.value,
      name: 'Bitcoin Cash',
      id: 'bch'
    }]

    return ({ btcBalance, ethBalance, bchBalance, chartData, symbol: btcFiatBalance.unit.symbol, btcAccountsLength, bchAccountsLength })
  }

  return lift(transform)(btcRates, ethRates, bchRates, settings)
}
