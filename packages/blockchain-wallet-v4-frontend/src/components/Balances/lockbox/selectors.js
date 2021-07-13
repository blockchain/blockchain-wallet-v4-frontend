import { lift, map, pathOr, sum } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getLockboxBtcBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getLockboxBtcContext,
    selectors.core.data.btc.getAddresses
  ],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map(a => pathOr(0, [a, 'final_balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(sum)
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
    return balancesR.map(sum)
  }
)

export const getLockboxEthBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getLockboxEthContext,
    selectors.core.data.eth.getAddresses
  ],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map(a => pathOr(0, [a, 'balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(sum)
  }
)

export const getLockboxXlmBalance = createDeepEqualSelector(
  [
    state =>
      selectors.core.kvStore.lockbox
        .getLockboxXlmContext(state)
        .map(
          map(accountId =>
            selectors.core.data.xlm.getBalance(state, accountId).getOrElse(0)
          )
        )
  ],
  lockboxXlmBalancesR => lockboxXlmBalancesR.map(sum)
)

export const getBtcBalanceInfo = createDeepEqualSelector(
  [
    getLockboxBtcBalance,
    selectors.core.data.btc.getRates,
    selectors.core.settings.getCurrency
  ],
  (btcBalanceR, btcRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertBtcToFiat({
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
    selectors.core.data.eth.getRates,
    selectors.core.settings.getCurrency
  ],
  (ethBalanceR, ethRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertEthToFiat({ value, fromUnit: 'WEI', toCurrency, rates })
        .value
    return lift(transform)(ethBalanceR, ethRatesR, currencyR)
  }
)

export const getXlmBalanceInfo = createDeepEqualSelector(
  [
    getLockboxXlmBalance,
    selectors.core.data.xlm.getRates,
    selectors.core.settings.getCurrency
  ],
  (xlmBalanceR, xlmRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertXlmToFiat({
        value,
        fromUnit: 'STROOP',
        toCurrency,
        rates
      }).value
    return lift(transform)(xlmBalanceR, xlmRatesR, currencyR)
  }
)

export const getTotalBalance = createDeepEqualSelector(
  [
    getBchBalanceInfo,
    getBtcBalanceInfo,
    getEthBalanceInfo,
    getXlmBalanceInfo,
    selectors.core.settings.getCurrency
  ],
  (
    btcBalanceInfoR,
    bchBalanceInfoR,
    ethBalanceInfoR,
    xlmBalanceInfoR,
    currency
  ) => {
    const transform = (
      bchBalance,
      btcBalance,
      ethBalance,
      xlmBalance,
      currency
    ) => {
      const total = Currency.formatFiat(
        Number(btcBalance) +
          Number(ethBalance) +
          Number(bchBalance) +
          Number(xlmBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance }
    }
    return lift(transform)(
      bchBalanceInfoR,
      btcBalanceInfoR,
      ethBalanceInfoR,
      xlmBalanceInfoR,
      currency
    )
  }
)
