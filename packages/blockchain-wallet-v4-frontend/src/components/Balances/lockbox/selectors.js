import { lift, map, pathOr, sum } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'blockchain-wallet-v4/src/exchange/utils'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getLockboxBtcBalance = createDeepEqualSelector(
  [selectors.core.kvStore.lockbox.getLockboxBtcContext, selectors.core.data.btc.getAddresses],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map((a) => pathOr(0, [a, 'final_balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(sum)
  }
)

export const getLockboxBchBalance = createDeepEqualSelector(
  [selectors.core.kvStore.lockbox.getLockboxBchContext, selectors.core.data.bch.getAddresses],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map((a) => pathOr(0, [a, 'final_balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(sum)
  }
)

export const getLockboxEthBalance = createDeepEqualSelector(
  [selectors.core.kvStore.lockbox.getLockboxEthContext, selectors.core.data.eth.getAddresses],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map((a) => pathOr(0, [a, 'balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(sum)
  }
)

export const getLockboxXlmBalance = createDeepEqualSelector(
  [
    (state) =>
      selectors.core.kvStore.lockbox
        .getLockboxXlmContext(state)
        .map(map((accountId) => selectors.core.data.xlm.getBalance(state, accountId).getOrElse(0)))
  ],
  (lockboxXlmBalancesR) => lockboxXlmBalancesR.map(sum)
)

export const getBtcBalanceInfo = createDeepEqualSelector(
  [
    getLockboxBtcBalance,
    selectors.core.settings.getCurrency,
    (state) => selectors.core.data.coins.getRates('BTC', state)
  ],
  (btcBalanceR, currencyR, btcRatesR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'BTC', currency: toCurrency, rates, value })
    return lift(transform)(btcBalanceR, btcRatesR, currencyR)
  }
)

export const getBchBalanceInfo = createDeepEqualSelector(
  [
    getLockboxBchBalance,
    selectors.core.settings.getCurrency,
    (state) => selectors.core.data.coins.getRates('BCH', state)
  ],
  (bchBalanceR, currencyR, bchRatesR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'BCH', currency: toCurrency, rates, value })
    return lift(transform)(bchBalanceR, bchRatesR, currencyR)
  }
)

export const getEthBalanceInfo = createDeepEqualSelector(
  [
    getLockboxEthBalance,
    selectors.core.settings.getCurrency,
    (state) => selectors.core.data.coins.getRates('ETH', state)
  ],
  (ethBalanceR, currencyR, ethRatesR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'ETH', currency: toCurrency, rates, value })
    return lift(transform)(ethBalanceR, ethRatesR, currencyR)
  }
)

export const getXlmBalanceInfo = createDeepEqualSelector(
  [
    getLockboxXlmBalance,
    selectors.core.settings.getCurrency,
    (state) => selectors.core.data.coins.getRates('XLM', state)
  ],
  (xlmBalanceR, currencyR, xlmRatesR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'XLM', currency: toCurrency, rates, value })
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
  (btcBalanceInfoR, bchBalanceInfoR, ethBalanceInfoR, xlmBalanceInfoR, currency) => {
    const transform = (bchBalance, btcBalance, ethBalance, xlmBalance, currency) => {
      const total = formatFiat(
        Number(btcBalance) + Number(ethBalance) + Number(bchBalance) + Number(xlmBalance)
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
