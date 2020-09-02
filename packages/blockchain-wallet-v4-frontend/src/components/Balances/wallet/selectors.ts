import { add, curry, lift, pathOr, prop, reduce } from 'ramda'
import {
  ExtractSuccess,
  InterestAccountBalanceType,
  InvitationsType,
  RemoteDataType,
  SBBalancesType,
  SBBalanceType,
  WalletCurrencyType,
  WalletFiatEnum,
  WalletFiatType
} from 'core/types'

import { convertBaseToStandard } from 'data/components/exchange/services'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { DEFAULT_INTEREST_BALANCE } from 'data/components/interest/model'
import { DEFAULT_SB_BALANCE } from 'data/components/simpleBuy/model'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'core/exchange/currency'
import {
  getErc20Balance as getErc20NonCustodialBalance,
  getEthBalance as getEthNonCustodialBalance,
  getXlmBalance as getXlmNonCustodialBalance
} from '../nonCustodial/selectors'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import BigNumber from 'bignumber.js'

export const getBtcBalance = createDeepEqualSelector(
  [
    selectors.core.wallet.getSpendableContext,
    selectors.core.data.btc.getAddresses,
    selectors.components.interest.getInterestAccountBalance,
    selectors.components.simpleBuy.getSBBalances
  ],
  (context, addressesR, interestAccountBalanceR, sbBalancesR) => {
    const contextToBalances = (
      context,
      balances,
      interestAccountBalance: InterestAccountBalanceType,
      sbBalances: SBBalancesType
    ): Array<number> => {
      const walletBalances: Array<number> = context.map(a =>
        pathOr(0, [a, 'final_balance'], balances)
      )
      const interestBalance = interestAccountBalance.BTC
        ? parseInt(interestAccountBalance.BTC.balance)
        : 0
      const sbBalance = Number(sbBalances.BTC ? sbBalances.BTC.available : 0)
      return walletBalances.concat(sbBalance).concat(interestBalance)
    }
    const balancesR = lift(contextToBalances)(
      Remote.of(context),
      addressesR,
      interestAccountBalanceR,
      sbBalancesR
    )
    return balancesR.map(reduce<number, number>(add, 0))
  }
)

export const getBchBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getSpendableContext,
    selectors.core.data.bch.getAddresses,
    selectors.components.interest.getInterestAccountBalance,
    selectors.components.simpleBuy.getSBBalances
  ],
  (context, addressesR, interestAccountBalanceR, sbBalancesR) => {
    const contextToBalances = (
      context,
      balances,
      interestAccountBalance: InterestAccountBalanceType,
      sbBalances: SBBalancesType
    ) => {
      const walletBalances: Array<number> = context.map(a =>
        pathOr(0, [a, 'final_balance'], balances)
      )
      const interestBalance = interestAccountBalance.BCH
        ? parseInt(interestAccountBalance.BCH.balance)
        : 0
      const sbBalance = Number(sbBalances.BCH ? sbBalances.BCH.available : 0)
      return walletBalances.concat(sbBalance).concat(interestBalance)
    }
    const balancesR = lift(contextToBalances)(
      Remote.of(context),
      addressesR,
      interestAccountBalanceR,
      sbBalancesR
    )
    return balancesR.map(reduce<number, number>(add, 0))
  }
)

export const getEthBalance = createDeepEqualSelector(
  [
    getEthNonCustodialBalance,
    selectors.components.interest.getInterestAccountBalance,
    selectors.components.simpleBuy.getSBBalances
  ],
  (
    balancesR,
    interestAccountBalanceR: RemoteDataType<string, InterestAccountBalanceType>,
    sbBalancesR: RemoteDataType<string, SBBalancesType>
  ) => {
    const interestEthBalance = interestAccountBalanceR.getOrElse({
      ETH: DEFAULT_INTEREST_BALANCE
    }).ETH
    const interestBalance = interestEthBalance ? interestEthBalance.balance : 0
    const sbEthBalance = sbBalancesR.getOrElse({ ETH: DEFAULT_SB_BALANCE }).ETH
    const sbBalance = sbEthBalance ? sbEthBalance.available : '0'

    return Remote.of(
      new BigNumber(balancesR.getOrElse(new BigNumber(0)))
        .plus(new BigNumber(sbBalance))
        .plus(new BigNumber(interestBalance))
    )
  }
)

export const getPaxBalance = createDeepEqualSelector(
  [
    getErc20NonCustodialBalance('pax'),
    selectors.components.interest.getInterestAccountBalance,
    selectors.components.simpleBuy.getSBBalances
  ],
  (
    balanceR,
    interestAccountBalanceR: RemoteDataType<string, InterestAccountBalanceType>,
    sbBalancesR: RemoteDataType<string, SBBalancesType>
  ) => {
    const interestPaxBalance = interestAccountBalanceR.getOrElse({
      PAX: DEFAULT_INTEREST_BALANCE
    }).PAX
    const interestBalance = interestPaxBalance
      ? interestPaxBalance.balance
      : '0'
    const sbPaxBalance = sbBalancesR.getOrElse({ PAX: DEFAULT_SB_BALANCE }).PAX
    const sbBalance = sbPaxBalance ? sbPaxBalance.available : '0'

    return Remote.of(
      new BigNumber(balanceR.getOrElse(0))
        .plus(new BigNumber(sbBalance))
        .plus(new BigNumber(interestBalance))
    )
  }
)

export const getUsdtBalance = createDeepEqualSelector(
  [
    getErc20NonCustodialBalance('usdt'),
    selectors.components.interest.getInterestAccountBalance,
    selectors.components.simpleBuy.getSBBalances
  ],
  (
    balanceR,
    interestAccountBalanceR: RemoteDataType<string, InterestAccountBalanceType>,
    sbBalancesR: RemoteDataType<string, SBBalancesType>
  ) => {
    const interestUsdtBalance = interestAccountBalanceR.getOrElse({
      USDT: DEFAULT_INTEREST_BALANCE
    }).USDT
    const interestBalance = interestUsdtBalance
      ? interestUsdtBalance.balance
      : '0'
    const sbUsdtBalance = sbBalancesR.getOrElse({ USDT: DEFAULT_SB_BALANCE })
      .USDT
    const sbBalance = sbUsdtBalance ? sbUsdtBalance.available : '0'

    return Remote.of(
      new BigNumber(balanceR.getOrElse(0))
        .plus(new BigNumber(sbBalance))
        .plus(new BigNumber(interestBalance))
    )
  }
)

export const getXlmBalance = createDeepEqualSelector(
  [
    getXlmNonCustodialBalance,
    selectors.components.interest.getInterestAccountBalance,
    selectors.components.simpleBuy.getSBBalances
  ],
  (
    balanceR,
    interestAccountBalanceR: RemoteDataType<string, InterestAccountBalanceType>,
    sbBalancesR: RemoteDataType<string, SBBalancesType>
  ) => {
    const interestXlmBalance = interestAccountBalanceR.getOrElse({
      XLM: DEFAULT_INTEREST_BALANCE
    }).XLM
    const interestBalance = interestXlmBalance
      ? interestXlmBalance.balance
      : '0'
    const sbXlmBalance = sbBalancesR.getOrElse({ XLM: DEFAULT_SB_BALANCE }).XLM
    const sbBalance = sbXlmBalance ? sbXlmBalance.available : '0'

    return Remote.of(
      new BigNumber(balanceR.getOrElse(0))
        .plus(new BigNumber(sbBalance))
        .plus(new BigNumber(interestBalance))
    )
  }
)

export const getAlgoBalance = createDeepEqualSelector(
  [selectors.components.simpleBuy.getSBBalances],
  (sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
    const sbAlgoBalance = sbBalancesR.getOrElse({ ALGO: DEFAULT_SB_BALANCE })
      .ALGO
    const sbBalance = sbAlgoBalance ? sbAlgoBalance.available : '0'

    return Remote.of(new BigNumber(sbBalance))
  }
)

export const getFiatBalance = curry(
  (
    currency: WalletFiatType,
    state: RootState
  ): RemoteDataType<string, SBBalanceType['available']> => {
    const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
    const fiatBalance =
      sbBalancesR.getOrElse({
        [currency]: DEFAULT_SB_BALANCE
      })[currency]?.available || '0'
    return Remote.of(convertBaseToStandard('FIAT', fiatBalance))
  }
)

export const getWithdrawableFiatBalance = curry(
  (
    currency: WalletFiatType,
    state: RootState
  ): RemoteDataType<string, SBBalanceType['withdrawable']> => {
    const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
    const fiatBalance =
      sbBalancesR.getOrElse({
        [currency]: DEFAULT_SB_BALANCE
      })[currency]?.withdrawable || '0'
    return Remote.of(convertBaseToStandard('FIAT', fiatBalance))
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

export const getFiatBalanceInfo = createDeepEqualSelector(
  [
    selectors.core.data.btc.getRates,
    selectors.core.settings.getCurrency,
    selectors.components.simpleBuy.getSBBalances
  ],
  (btcRatesR, currencyR, sbBalancesR) => {
    const transform = (
      rates,
      currency,
      sbBalances: ExtractSuccess<typeof sbBalancesR>
    ) => {
      const keys = Object.keys(WalletFiatEnum).filter(
        value => typeof WalletFiatEnum[value] === 'number'
      )

      // @ts-ignore
      const balances = keys.map((value: WalletFiatType) => {
        const standard = convertBaseToStandard(
          'FIAT',
          sbBalances[value]?.available || '0'
        )

        if (value === currency) return Number(standard)

        return Exchange.convertFiatToFiat({
          value: standard,
          fromCurrency: value,
          toCurrency: currency,
          rates
        }).value
      })

      return balances.reduce(add, 0)
    }

    return lift(transform)(btcRatesR, currencyR, sbBalancesR)
  }
)

export const getTotalBalance = createDeepEqualSelector(
  [
    getBchBalanceInfo,
    getBtcBalanceInfo,
    getEthBalanceInfo,
    getPaxBalanceInfo,
    getXlmBalanceInfo,
    getFiatBalanceInfo,
    selectors.core.settings.getCurrency
  ],
  (
    btcBalanceInfoR,
    bchBalanceInfoR,
    ethBalanceInfoR,
    paxBalanceInfoR,
    xlmBalanceInfoR,
    fiatBalanceInfoR,
    currency
  ) => {
    const transform = (
      bchBalance,
      btcBalance,
      ethBalance,
      paxBalance,
      xlmBalance,
      fiatBalance,
      currency
    ) => {
      const total = formatFiat(
        Number(btcBalance) +
          Number(ethBalance) +
          Number(bchBalance) +
          Number(paxBalance) +
          Number(xlmBalance) +
          Number(fiatBalance)
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
      fiatBalanceInfoR,
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
