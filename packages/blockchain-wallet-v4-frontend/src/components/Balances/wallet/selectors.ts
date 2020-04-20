import { add, lift, pathOr, prop, reduce } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'core/exchange/currency'
import { RemoteDataType, SBBalancesType } from 'core/types'
import { selectors } from 'data'
import BigNumber from 'bignumber.js'

export const getBtcBalance = createDeepEqualSelector(
  [
    selectors.core.wallet.getSpendableContext,
    selectors.core.data.btc.getAddresses,
    selectors.components.simpleBuy.getSBBalances
  ],
  (context, addressesR, sbBalancesR) => {
    const contextToBalances = (
      context,
      balances,
      sbBalances: SBBalancesType
    ): Array<number> => {
      const walletBalances: Array<number> = context.map(a =>
        pathOr(0, [a, 'final_balance'], balances)
      )
      const sbBalance = Number(sbBalances.BTC ? sbBalances.BTC.available : 0)
      return walletBalances.concat(sbBalance)
    }
    const balancesR = lift(contextToBalances)(
      Remote.of(context),
      addressesR,
      sbBalancesR
    )
    return balancesR.map(reduce<number, number>(add, 0))
  }
)

export const getBchBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getSpendableContext,
    selectors.core.data.bch.getAddresses,
    selectors.components.simpleBuy.getSBBalances
  ],
  (context, addressesR, sbBalancesR) => {
    const contextToBalances = (
      context,
      balances,
      sbBalances: SBBalancesType
    ) => {
      const walletBalances: Array<number> = context.map(a =>
        pathOr(0, [a, 'final_balance'], balances)
      )
      const sbBalance = Number(sbBalances.BCH ? sbBalances.BCH.available : 0)
      return walletBalances.concat(sbBalance)
    }
    const balancesR = lift(contextToBalances)(
      Remote.of(context),
      addressesR,
      sbBalancesR
    )
    return balancesR.map(reduce<number, number>(add, 0))
  }
)

export const getEthBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.eth.getContext,
    selectors.core.data.eth.getAddresses,
    selectors.components.simpleBuy.getSBBalances
  ],
  (
    context,
    addressesR,
    sbBalancesR: RemoteDataType<string, SBBalancesType>
  ) => {
    const contextToBalances = (context, balances) =>
      context.map(a => pathOr(0, [a, 'balance'], balances))

    const sbEthBalance = sbBalancesR.getOrElse({ ETH: { available: '0' } }).ETH
    const sbBalance = sbEthBalance ? sbEthBalance.available : '0'

    const balancesR: RemoteDataType<string, string> = lift(contextToBalances)(
      Remote.of(context),
      addressesR
    )
    return balancesR.map(b => {
      return new BigNumber(b.getOrElse(0)).plus(new BigNumber(sbBalance))
    })
  }
)

export const getPaxBalance = createDeepEqualSelector(
  [
    state => selectors.core.data.eth.getErc20Balance(state, 'pax'),
    selectors.components.simpleBuy.getSBBalances
  ],
  (balanceR, sbBalancesR) => {
    const sbPaxBalance = sbBalancesR.getOrElse({ PAX: { available: '0' } }).PAX
    const sbBalance = sbPaxBalance ? sbPaxBalance.available : '0'

    return Remote.of(
      new BigNumber(balanceR.getOrElse(0)).plus(new BigNumber(sbBalance))
    )
  }
)

export const getXlmBalance = createDeepEqualSelector(
  [
    state =>
      selectors.core.kvStore.xlm
        .getDefaultAccountId(state)
        .map(accountId =>
          selectors.core.data.xlm.getBalance(state, accountId).getOrElse(0)
        ),
    selectors.components.simpleBuy.getSBBalances
  ],
  (balanceR, sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
    const sbXlmBalance = sbBalancesR.getOrElse({ XLM: { available: '0' } }).XLM
    const sbBalance = sbXlmBalance ? sbXlmBalance.available : '0'

    return Remote.of(
      new BigNumber(balanceR.getOrElse(0)).plus(new BigNumber(sbBalance))
    )
  }
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
    selectors.core.settings.getCurrency
  ],
  (
    btcBalanceInfoR,
    bchBalanceInfoR,
    ethBalanceInfoR,
    paxBalanceInfoR,
    xlmBalanceInfoR,
    currency
  ) => {
    const transform = (
      bchBalance,
      btcBalance,
      ethBalance,
      paxBalance,
      xlmBalance,
      currency
    ) => {
      const total = formatFiat(
        Number(btcBalance) +
          Number(ethBalance) +
          Number(bchBalance) +
          Number(paxBalance) +
          Number(xlmBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance }
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
