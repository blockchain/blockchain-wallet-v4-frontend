import { lift } from 'ramda'
import { selectors } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getBchBalance = createDeepEqualSelector(
  [
    selectors.core.data.bch.getSpendableBalance,
    selectors.core.data.bch.getRates,
    selectors.core.settings.getCurrency
  ],
  (bchBalanceR, bchRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => Exchange.convertBchToFiat({ value, fromUnit: 'SAT', toCurrency, rates }).value
    return lift(transform)(bchBalanceR, bchRatesR, currencyR)
  }
)

export const getBtcBalance = createDeepEqualSelector(
  [
    selectors.core.data.bitcoin.getSpendableBalance,
    selectors.core.data.bitcoin.getRates,
    selectors.core.settings.getCurrency
  ],
  (btcBalanceR, btcRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => Exchange.convertBitcoinToFiat({ value, fromUnit: 'SAT', toCurrency, rates }).value
    return lift(transform)(btcBalanceR, btcRatesR, currencyR)
  }
)

export const getEthBalance = createDeepEqualSelector(
  [
    selectors.core.data.ethereum.getBalance,
    selectors.core.data.ethereum.getRates,
    selectors.core.settings.getCurrency
  ],
  (ethBalanceR, ethRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => Exchange.convertEtherToFiat({ value, fromUnit: 'WEI', toCurrency, rates }).value
    return lift(transform)(ethBalanceR, ethRatesR, currencyR)
  }
)

export const getData = createDeepEqualSelector(
  [
    getBchBalance,
    getBtcBalance,
    getEthBalance,
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
  ],
  (btcBalanceR, bchBalanceR, ethBalanceR, currency, path) => {
    const transform = (bchBalance, btcBalance, ethBalance, currency) => {
      const total = Currency.formatFiat(Number(btcBalance) + Number(ethBalance) + Number(bchBalance))
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return ({ totalBalance, path })
    }
    return lift(transform)(bchBalanceR, btcBalanceR, ethBalanceR, currency)
  }
)
