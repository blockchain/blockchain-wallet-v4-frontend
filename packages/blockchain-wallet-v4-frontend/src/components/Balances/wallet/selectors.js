import { add, lift, pathOr, reduce } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Remote, Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

export const getBtcBalance = createDeepEqualSelector(
  [
    selectors.core.wallet.getSpendableContext,
    selectors.core.data.bitcoin.getAddresses
  ],
  (context, addressesR) => {
    const contextToBalances = (context, balances) => {
      return context.map(a => pathOr(0, [a, 'final_balance'], balances))
    }
    const balancesR = lift(contextToBalances)(Remote.of(context), addressesR)
    return balancesR.map(reduce(add, 0))
  }
)

export const getBchBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getSpendableContext,
    selectors.core.data.bch.getAddresses
  ],
  (context, addressesR) => {
    const contextToBalances = (context, balances) =>
      context.map(a => pathOr(0, [a, 'final_balance'], balances))
    const balancesR = lift(contextToBalances)(Remote.of(context), addressesR)
    return balancesR.map(reduce(add, 0))
  }
)

export const getEthBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.ethereum.getContext,
    selectors.core.data.ethereum.getAddresses
  ],
  (context, addressesR) => {
    const contextToBalances = (context, balances) =>
      context.map(a => pathOr(0, [a, 'balance'], balances))
    const balancesR = lift(contextToBalances)(Remote.of(context), addressesR)
    return balancesR.map(b => b.getOrElse(0))
  }
)

export const getBtcBalanceInfo = createDeepEqualSelector(
  [
    getBtcBalance,
    selectors.core.data.bitcoin.getRates,
    selectors.core.settings.getCurrency
  ],
  (btcBalanceR, btcRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertBitcoinToFiat({
        value,
        fromUnit: 'SAT',
        toCurrency,
        rates
      }).value
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
    const transform = (value, rates, toCurrency) =>
      Exchange.convertBchToFiat({ value, fromUnit: 'SAT', toCurrency, rates })
        .value
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
    const transform = (value, rates, toCurrency) =>
      Exchange.convertEtherToFiat({ value, fromUnit: 'WEI', toCurrency, rates })
        .value
    return lift(transform)(ethBalanceR, ethRatesR, currencyR)
  }
)

export const getTotalBalance = createDeepEqualSelector(
  [
    getBchBalanceInfo,
    getBtcBalanceInfo,
    getEthBalanceInfo,
    selectors.core.settings.getCurrency
  ],
  (btcBalanceInfoR, bchBalanceInfoR, ethBalanceInfoR, currency) => {
    const transform = (bchBalance, btcBalance, ethBalance, currency) => {
      const total = Currency.formatFiat(
        Number(btcBalance) + Number(ethBalance) + Number(bchBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance }
    }
    return lift(transform)(
      bchBalanceInfoR,
      btcBalanceInfoR,
      ethBalanceInfoR,
      currency
    )
  }
)

export const getCoinAndTotalBalances = createDeepEqualSelector(
  [getBchBalance, getBtcBalance, getEthBalance, getTotalBalance],
  (btcBalanceInfoR, bchBalanceInfoR, ethBalanceInfoR, getTotalBalanceR) => {
    const transform = (bchBalance, btcBalance, ethBalance, totalBalance) => {
      return { bchBalance, btcBalance, ethBalance, totalBalance }
    }
    return lift(transform)(
      bchBalanceInfoR,
      btcBalanceInfoR,
      ethBalanceInfoR,
      getTotalBalanceR
    )
  }
)
