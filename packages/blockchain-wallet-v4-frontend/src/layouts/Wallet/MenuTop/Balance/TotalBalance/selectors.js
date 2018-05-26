import { lift } from 'ramda'
import { selectors } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

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
  const path = state.router.location.pathname

  const transform = (bitcoinRates, ethereumRates, bchRates, settings) => {
    const bitcoinFiatBalance = Exchange.convertBitcoinToFiat({ value: bitcoinBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bitcoinRates })
    const etherFiatBalance = Exchange.convertEtherToFiat({ value: etherBalance, fromUnit: 'WEI', toCurrency: settings.currency, rates: ethereumRates })
    const bchFiatBalance = Exchange.convertBchToFiat({ value: bchBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bchRates })
    const totalFiatBalance = Number(bitcoinFiatBalance.value) + Number(etherFiatBalance.value) + Number(bchFiatBalance.value)
    const totalFiatBalanceFormatted = Currency.formatFiat(totalFiatBalance)
    const symbol = bitcoinRates[settings.currency].symbol
    return ({ symbol, bitcoinBalance, etherBalance, bchBalance, bitcoinFiatBalance, etherFiatBalance, bchFiatBalance, totalFiatBalanceFormatted, path })
  }

  return lift(transform)(bitcoinRates, ethereumRates, bchRates, settings)
}
