import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { add, lift, map, prop, reduce } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import {
  getBchBalance as getBchWalletBalance,
  getBtcBalance as getBtcWalletBalance,
  getEthBalance as getEthWalletBalance,
  getPaxBalance as getPaxWalletBalance,
  getXlmBalance as getXlmWalletBalance
} from '../wallet/selectors'
import { selectors } from 'data'

export const getBtcBalance = createDeepEqualSelector(
  [
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

    return balancesR.map(reduce(add, 0))
  }
)

export const getBchBalance = createDeepEqualSelector(
  [
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
    return balancesR.map(reduce(add, 0))
  }
)

export const getEthBalance = getEthWalletBalance
export const getPaxBalance = getPaxWalletBalance
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
    const invitations = invitationsR.getOrElse({ PAX: false })
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
    bchBalanceInfoR,
    btcBalanceInfoR,
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
