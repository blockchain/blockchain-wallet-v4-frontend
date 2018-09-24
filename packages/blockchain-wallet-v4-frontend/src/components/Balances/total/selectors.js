import { add, concat, lift, reduce } from 'ramda'
import { selectors } from 'data'
import { Remote, Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getBtcBalance = state =>
  createDeepEqualSelector(
    [
      selectors.core.wallet.getSpendableContext,
      selectors.core.kvStore.lockbox.getLockboxBtcContext
    ],
    (walletContext, lockboxBtcContextR) => {
      const getBalance = address =>
        selectors.core.data.bitcoin.getFinalBalance(address, state)
      const transform = (walletContext, lockboxContext) => {
        return concat(walletContext, lockboxContext).map(x =>
          getBalance(x).getOrElse(0)
        )
      }
      const balancesR = lift(transform)(
        Remote.of(walletContext),
        lockboxBtcContextR
      )
      return balancesR.map(reduce(add, 0))
    }
  )(state)

export const getBchBalance = state =>
  createDeepEqualSelector(
    [
      selectors.core.kvStore.bch.getSpendableContext,
      selectors.core.kvStore.lockbox.getLockboxBchContext
    ],
    (walletContext, lockboxBchContextR) => {
      const getBalance = address =>
        selectors.core.data.bch.getFinalBalance(address, state)
      const transform = (walletContext, lockboxContext) => {
        return concat(walletContext, lockboxContext).map(x =>
          getBalance(x).getOrElse(0)
        )
      }
      const balancesR = lift(transform)(
        Remote.of(walletContext),
        lockboxBchContextR
      )
      return balancesR.map(reduce(add, 0))
    }
  )(state)

export const getEthBalance = state =>
  createDeepEqualSelector(
    [selectors.core.data.ethereum.getBalance],
    balance => {
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
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
  ],
  (btcBalanceInfoR, bchBalanceInfoR, ethBalanceInfoR, currency, path) => {
    const transform = (bchBalance, btcBalance, ethBalance, currency) => {
      const total = Currency.formatFiat(
        Number(btcBalance) + Number(ethBalance) + Number(bchBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance, path }
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
  [getBtcBalance, getBchBalance, getEthBalance, getTotalBalance],
  (btcBalanceR, bchBalanceR, ethBalanceR, getTotalBalanceR) => {
    const transform = (btcBalance, bchBalance, ethBalance, totalBalance) => {
      return { btcBalance, bchBalance, ethBalance, totalBalance }
    }
    return lift(transform)(
      btcBalanceR,
      bchBalanceR,
      ethBalanceR,
      getTotalBalanceR
    )
  }
)
