import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { add, lift, map, prop, reduce } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import {
  getAlgoBalance as getAlgoWalletBalance,
  getBchBalance as getBchWalletBalance,
  getBtcBalance as getBtcWalletBalance,
  getEthBalance as getEthWalletBalance,
  getFiatBalance,
  getPaxBalance as getPaxWalletBalance,
  getUsdtBalance as getUsdtWalletBalance,
  getXlmBalance as getXlmWalletBalance
} from '../wallet/selectors'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { InvitationsType, WalletCurrencyType } from 'core/types'
import { selectors } from 'data'

export const getBtcBalance = createDeepEqualSelector(
  [
    // @ts-ignore
    state => getBtcWalletBalance(state),
    state =>
      selectors.core.kvStore.lockbox
        .getLockboxBtcContext(state)
        .map(
          map(address =>
            selectors.core.data.btc.getFinalBalance(state, address)
          )
        )
  ],
  (walletBalance, lockboxBalancesR) => {
    const modulesToBalance = (walletBalance, lockboxBalances) => {
      const lbBalances = lockboxBalances.map(b => b.getOrElse(0))
      return lbBalances.concat(walletBalance)
    }
    const balancesR = lift(modulesToBalance)(walletBalance, lockboxBalancesR)

    // @ts-ignore
    return balancesR.map(reduce(add, 0))
  }
)

export const getBchBalance = createDeepEqualSelector(
  [
    // @ts-ignore
    state => getBchWalletBalance(state),
    state =>
      selectors.core.kvStore.lockbox
        .getLockboxBchContext(state)
        .map(
          map(address =>
            selectors.core.data.bch.getFinalBalance(state, address)
          )
        )
  ],
  (walletBalancesR, lockboxBalancesR) => {
    const modulesToBalance = (walletBalance, lockboxBalances) => {
      const lbBalances = lockboxBalances.map(b => b.getOrElse(0))
      return lbBalances.concat(walletBalance)
    }
    const balancesR = lift(modulesToBalance)(walletBalancesR, lockboxBalancesR)
    // @ts-ignore
    return balancesR.map(reduce(add, 0))
  }
)

export const getAlgoBalance = getAlgoWalletBalance
export const getEthBalance = getEthWalletBalance
export const getPaxBalance = getPaxWalletBalance
export const getUsdtBalance = getUsdtWalletBalance
export const getXlmBalance = getXlmWalletBalance

export const getBtcBalanceInfo = createDeepEqualSelector(
  [
    getBtcBalance,
    selectors.core.data.btc.getRates,
    selectors.core.settings.getCurrency
  ],
  (btcBalanceR, btcRatesR, currencyR) => {
    const value = btcBalanceR.getOrElse(0)
    const transform = (rates, toCurrency) =>
      Exchange.convertBtcToFiat({
        // @ts-ignore
        value,
        fromUnit: 'SAT',
        toCurrency,
        rates
      }).value
    return lift(transform)(btcRatesR, currencyR)
  }
)

export const getBchBalanceInfo = createDeepEqualSelector(
  [
    getBchBalance,
    selectors.core.data.bch.getRates,
    selectors.core.settings.getCurrency
  ],
  (bchBalanceR, bchRatesR, currencyR) => {
    const value = bchBalanceR.getOrElse(0)
    const transform = (rates, toCurrency) =>
      Exchange.convertBchToFiat({
        // @ts-ignore
        value,
        fromUnit: 'SAT',
        toCurrency,
        rates
      }).value
    return lift(transform)(bchRatesR, currencyR)
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
      return Exchange.convertEthToFiat({
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
  [
    getPaxBalance,
    state => selectors.core.data.eth.getErc20Rates(state, 'pax'),
    selectors.core.settings.getCurrency,
    selectors.core.settings.getInvitations
  ],
  (paxBalanceR, erc20RatesR, currencyR, invitationsR) => {
    const invitations = invitationsR.getOrElse({
      PAX: false
    } as InvitationsType)
    const invited = prop('PAX', invitations)
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertPaxToFiat({
        value,
        fromUnit: 'WEI',
        toCurrency,
        rates
      }).value
    }

    return invited
      ? lift(transform)(paxBalanceR, erc20RatesR, currencyR)
      : Remote.Success(0)
  }
)

export const getUsdtBalanceInfo = createDeepEqualSelector(
  [
    getUsdtBalance,
    state => selectors.core.data.eth.getErc20Rates(state, 'usdt'),
    selectors.core.settings.getCurrency,
    selectors.core.settings.getInvitations
  ],
  (usdtBalanceR, erc20RatesR, currencyR, invitationsR) => {
    const invitations = invitationsR.getOrElse({
      USDT: false
    } as InvitationsType)
    const invited = prop('USDT', invitations)
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertUsdtToFiat({
        value,
        fromUnit: 'WEI',
        toCurrency,
        rates
      }).value
    }

    return invited
      ? lift(transform)(usdtBalanceR, erc20RatesR, currencyR)
      : Remote.Success(0)
  }
)

export const getAlgoBalanceInfo = createDeepEqualSelector(
  [
    getAlgoBalance,
    selectors.core.data.algo.getRates,
    selectors.core.settings.getCurrency
  ],
  (algoBalanceR, algoRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertAlgoToFiat({
        value,
        fromUnit: 'mALGO',
        toCurrency,
        rates
      }).value
    return lift(transform)(algoBalanceR, algoRatesR, currencyR)
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
    getAlgoBalanceInfo,
    getBchBalanceInfo,
    getBtcBalanceInfo,
    getEthBalanceInfo,
    getPaxBalanceInfo,
    getUsdtBalanceInfo,
    getXlmBalanceInfo,
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
  ],
  (
    algoBalanceInfoR,
    bchBalanceInfoR,
    btcBalanceInfoR,
    ethBalanceInfoR,
    paxBalanceInfoR,
    usdtBalanceInfoR,
    xlmBalanceInfoR,
    currency,
    path
  ) => {
    const transform = (
      algoBalance,
      bchBalance,
      btcBalance,
      ethBalance,
      paxBalance,
      usdtBalance,
      xlmBalance,
      currency
    ) => {
      const total = Currency.formatFiat(
        Number(btcBalance) +
          Number(ethBalance) +
          Number(bchBalance) +
          Number(algoBalance) +
          Number(xlmBalance) +
          Number(usdtBalance) +
          Number(paxBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance, path }
    }
    return lift(transform)(
      algoBalanceInfoR,
      bchBalanceInfoR,
      btcBalanceInfoR,
      ethBalanceInfoR,
      paxBalanceInfoR,
      usdtBalanceInfoR,
      xlmBalanceInfoR,
      currency
    )
  }
)

export const getBalanceSelector = (coin: WalletCurrencyType) => {
  switch (coin) {
    case 'BTC':
      return getBtcBalance
    case 'BCH':
      return getBchBalance
    case 'ETH':
      return getEthBalance
    case 'PAX':
      return getPaxBalance
    case 'XLM':
      return getXlmBalance
    case 'USDT':
      return getUsdtBalance
    case 'ALGO':
      return getAlgoBalance
    case 'EUR':
    case 'GBP':
      return getFiatBalance(coin)
    default:
      return Remote.Failure(INVALID_COIN_TYPE)
  }
}
