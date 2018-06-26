import { add, lift, reduce } from 'ramda'
import { selectors } from 'data'
import { Remote, Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getBtcBalance = state => createDeepEqualSelector(
  [
    selectors.core.wallet.getSpendableContext
  ],
  (context) => {
    const getBalance = address => selectors.core.data.bitcoin.getFinalBalance(address, state)
    const balancesR = context.map(x => getBalance(x).getOrElse(0))
    return Remote.of(reduce(add, 0, balancesR))
  }
)(state)

export const getBchBalance = state => createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getSpendableContext
  ],
  (context) => {
    const getBalance = address => selectors.core.data.bch.getFinalBalance(address, state)
    const balancesR = context.map(x => getBalance(x).getOrElse(0))
    return Remote.of(reduce(add, 0, balancesR))
  }
)(state)

export const getEthBalance = state => createDeepEqualSelector(
  [
    selectors.core.data.ethereum.getBalance
  ],
  (balance) => {
    return Remote.of(balance.getOrElse(0))
  }
)(state)

export const getBtcBalanceInfo = createDeepEqualSelector(
  [
    getBtcBalance,
    selectors.core.data.bitcoin.getRates,
    selectors.core.settings.getCurrency
  ],
  (btcBalanceR, btcRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => Exchange.convertBitcoinToFiat({ value, fromUnit: 'SAT', toCurrency, rates }).value
    return lift(transform)(btcBalanceR, btcRatesR, currencyR)
  }
)

export const getBchBalanceInfo = createDeepEqualSelector(
  [
    getBchBalance,
    selectors.core.data.bch.getRates,
    selectors.core.settings.getCurrency
  ],
  (bchBalanceR, bchRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => Exchange.convertBchToFiat({ value, fromUnit: 'SAT', toCurrency, rates }).value
    return lift(transform)(bchBalanceR, bchRatesR, currencyR)
  }
)

export const getEthBalanceInfo = createDeepEqualSelector(
  [
    getEthBalance,
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
    getBchBalanceInfo,
    getBtcBalanceInfo,
    getEthBalanceInfo,
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
  ],
  (btcBalanceInfoR, bchBalanceInfoR, ethBalanceInfoR, currency, path) => {
    const transform = (bchBalance, btcBalance, ethBalance, currency) => {
      const total = Currency.formatFiat(Number(btcBalance) + Number(ethBalance) + Number(bchBalance))
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return ({ totalBalance, path })
    }
    return lift(transform)(bchBalanceInfoR, btcBalanceInfoR, ethBalanceInfoR, currency)
  }
)
