import { add, concat, lift, map, reduce } from 'ramda'
import { selectors } from 'data'
import { Remote, Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getBtcBalance = createDeepEqualSelector(
  [
    state =>
      map(
        address =>
          selectors.core.data.btc.getFinalBalance(state, address).getOrElse(0),
        selectors.core.wallet.getSpendableContext(state)
      ),
    state =>
      selectors.core.kvStore.lockbox
        .getLockboxBtcContext(state)
        .map(
          map(address =>
            selectors.core.data.btc.getFinalBalance(state, address).getOrElse(0)
          )
        )
  ],
  (walletBalances, lockboxBalancesR) =>
    lockboxBalancesR.map(concat(walletBalances)).map(reduce(add, 0))
)

export const getBchBalance = createDeepEqualSelector(
  [
    state =>
      map(
        address =>
          selectors.core.data.bch.getFinalBalance(state, address).getOrElse(0),
        selectors.core.kvStore.bch.getSpendableContext(state)
      ),
    state =>
      selectors.core.kvStore.lockbox
        .getLockboxBchContext(state)
        .map(
          map(address =>
            selectors.core.data.bch.getFinalBalance(state, address).getOrElse(0)
          )
        )
  ],
  (walletBalances, lockboxBalancesR) =>
    lockboxBalancesR.map(concat(walletBalances)).map(reduce(add, 0))
)

export const getEthBalance = createDeepEqualSelector(
  [selectors.core.data.eth.getBalance],
  balance => Remote.of(balance.getOrElse(0))
)

export const getPaxBalance = createDeepEqualSelector(
  [state => selectors.core.data.eth.getErc20Balance(state, 'pax')],
  balance => {
    return Remote.of(balance.getOrElse(0))
  }
)

export const getXlmBalance = createDeepEqualSelector(
  [selectors.core.data.xlm.getTotalBalance],
  balance => Remote.of(balance.getOrElse(0))
)

export const getBtcBalanceInfo = createDeepEqualSelector(
  [
    getBtcBalance,
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
    selectors.core.data.eth.getRates,
    selectors.core.settings.getCurrency
  ],
  (ethBalanceR, ethRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertEtherToFiat({
        value,
        fromUnit: 'WEI',
        toCurrency,
        rates
      }).value
    }

    return lift(transform)(ethBalanceR, ethRatesR, currencyR)
  }
)

export const getPaxBalanceInfo = createDeepEqualSelector(
  [getPaxBalance, selectors.core.settings.getCurrency],
  (paxBalanceR, currencyR) => {
    const transform = (value, toCurrency) => {
      // TODO PAX
      return 0
    }

    return lift(transform)(paxBalanceR, currencyR)
  }
)

export const getXlmBalanceInfo = createDeepEqualSelector(
  [
    getXlmBalance,
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
    getPaxBalanceInfo,
    getXlmBalanceInfo,
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
  ],
  (
    btcBalanceInfoR,
    bchBalanceInfoR,
    ethBalanceInfoR,
    paxBalanceInfoR,
    xlmBalanceInfoR,
    currency,
    path
  ) => {
    const transform = (
      bchBalance,
      btcBalance,
      ethBalance,
      paxBalance,
      xlmBalance,
      currency
    ) => {
      const total = Currency.formatFiat(
        Number(btcBalance) +
          Number(ethBalance) +
          Number(bchBalance) +
          Number(paxBalance) +
          Number(xlmBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance, path }
    }
    return lift(transform)(
      bchBalanceInfoR,
      btcBalanceInfoR,
      ethBalanceInfoR,
      paxBalanceInfoR,
      xlmBalanceInfoR,
      currency
    )
  }
)

export const getCoinAndTotalBalances = createDeepEqualSelector(
  [
    getBtcBalance,
    getBchBalance,
    getEthBalance,
    getPaxBalance,
    getXlmBalance,
    getTotalBalance
  ],
  (
    btcBalanceR,
    bchBalanceR,
    ethBalanceR,
    paxBalanceR,
    xlmBalanceR,
    getTotalBalanceR
  ) => {
    const transform = (
      btcBalance,
      bchBalance,
      ethBalance,
      paxBalance,
      xlmBalance,
      totalBalance
    ) => {
      return {
        btcBalance,
        bchBalance,
        ethBalance,
        paxBalance,
        xlmBalance,
        totalBalance
      }
    }
    return lift(transform)(
      btcBalanceR,
      bchBalanceR,
      ethBalanceR,
      paxBalanceR,
      xlmBalanceR,
      getTotalBalanceR
    )
  }
)
