import { lift } from 'ramda'
import { selectors } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'

export const getData = (state) => {
  const btcBalanceR = selectors.core.data.bitcoin.getBalance(state)
  const ethBalanceR = selectors.core.data.ethereum.getBalance(state)
  const bchBalanceR = selectors.core.data.bch.getBalance(state)
  const btcBalance = btcBalanceR.getOrElse(0)
  const ethBalance = ethBalanceR.getOrElse(0)
  const bchBalance = bchBalanceR.getOrElse(0)
  const btcRates = selectors.core.data.bitcoin.getRates(state)
  const ethRates = selectors.core.data.ethereum.getRates(state)
  const bchRates = selectors.core.data.bch.getRates(state)
  const settings = selectors.core.settings.getSettings(state)
  const path = state.router.location.pathname

  const transform = (btcRates, ethRates, bchRates, settings) => {
    const btcFiatBalance = Exchange.convertBitcoinToFiat({ value: btcBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: btcRates })
    const ethFiatBalance = Exchange.convertEtherToFiat({ value: ethBalance, fromUnit: 'WEI', toCurrency: settings.currency, rates: ethRates })
    const bchFiatBalance = Exchange.convertBchToFiat({ value: bchBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bchRates })
    const totalFiatBalance = Number(btcFiatBalance.value) + Number(ethFiatBalance.value) + Number(bchFiatBalance.value)
    const symbol = btcRates[settings.currency].symbol
    return ({ symbol, totalFiatBalance, path })
  }

  return lift(transform)(btcRates, ethRates, bchRates, settings)
}
