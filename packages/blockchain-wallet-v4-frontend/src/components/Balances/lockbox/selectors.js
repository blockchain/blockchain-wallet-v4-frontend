import { add, lift, pathOr, reduce } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

export const getLockboxBtcBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getLockboxBtcContext,
    selectors.core.data.bitcoin.getAddresses
  ],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map(a => pathOr(0, [a, 'final_balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(reduce(add, 0))
  }
)

export const getLockboxBchBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getLockboxBchContext,
    selectors.core.data.bch.getAddresses
  ],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map(a => pathOr(0, [a, 'final_balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(reduce(add, 0))
  }
)

export const getLockboxEthBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getLockboxEthContext,
    selectors.core.data.ethereum.getAddresses
  ],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map(a => pathOr(0, [a, 'balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(reduce(add, 0))
  }
)

export const getBtcBalanceInfo = createDeepEqualSelector(
  [
    getLockboxBtcBalance,
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
    getLockboxBchBalance,
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
    getLockboxEthBalance,
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
  [
    getLockboxBchBalance,
    getLockboxBtcBalance,
    getLockboxEthBalance,
    getTotalBalance
  ],
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
