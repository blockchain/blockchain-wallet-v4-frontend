import BigNumber from 'bignumber.js'
import { add, curry, flatten, lift, pathOr, reduce } from 'ramda'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'blockchain-wallet-v4/src/exchange/currency'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import {
  ExtractSuccess,
  InterestAccountBalanceType,
  RemoteDataType,
  SBBalancesType,
  SBBalanceType,
  WalletCurrencyType,
  WalletFiatEnum,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { DEFAULT_INTEREST_BALANCE } from 'data/components/interest/model'
import { DEFAULT_SB_BALANCE } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'

import {
  getErc20Balance as getErc20NonCustodialBalance,
  getEthBalance as getEthNonCustodialBalance,
  getXlmBalance as getXlmNonCustodialBalance
} from './nonCustodial/selectors'

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
      const walletBalances: Array<number> = flatten(context).map(a =>
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

export const getYfiBalance = createDeepEqualSelector(
  [
    getErc20NonCustodialBalance('yfi'),
    selectors.components.simpleBuy.getSBBalances
  ],
  (balanceR, sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
    const sbYfiBalance = sbBalancesR.getOrElse({ YFI: DEFAULT_SB_BALANCE }).YFI
    const sbBalance = sbYfiBalance ? sbYfiBalance.available : '0'

    return Remote.of(
      new BigNumber(balanceR.getOrElse(0)).plus(new BigNumber(sbBalance))
    )
  }
)

export const getAaveBalance = createDeepEqualSelector(
  [
    getErc20NonCustodialBalance('aave'),
    selectors.components.simpleBuy.getSBBalances
  ],
  (balanceR, sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
    const sbAaveBalance = sbBalancesR.getOrElse({ AAVE: DEFAULT_SB_BALANCE })
      .AAVE
    const sbBalance = sbAaveBalance ? sbAaveBalance.available : '0'

    return Remote.of(
      new BigNumber(balanceR.getOrElse(0)).plus(new BigNumber(sbBalance))
    )
  }
)

export const getDotBalance = createDeepEqualSelector(
  [selectors.components.simpleBuy.getSBBalances],
  (sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
    const sbDotBalance = sbBalancesR.getOrElse({ DOT: DEFAULT_SB_BALANCE }).DOT
    const sbBalance = sbDotBalance ? sbDotBalance.available : '0'

    return Remote.of(new BigNumber(sbBalance))
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

export const getWdgldBalance = createDeepEqualSelector(
  [
    getErc20NonCustodialBalance('wdgld'),
    selectors.components.simpleBuy.getSBBalances
  ],
  (balanceR, sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
    const sbWdgldBalance = sbBalancesR.getOrElse({ WDGLD: DEFAULT_SB_BALANCE })
      .WDGLD
    const sbBalance = sbWdgldBalance ? sbWdgldBalance.available : '0'

    return Remote.of(
      new BigNumber(balanceR.getOrElse(0)).plus(new BigNumber(sbBalance))
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
    selectors.core.settings.getCurrency
  ],
  (paxBalanceR, erc20RatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertPaxToFiat({
        value,
        fromUnit: 'WEI',
        toCurrency,
        rates
      }).value
    }

    return lift(transform)(paxBalanceR, erc20RatesR, currencyR)
  }
)

export const getAaveBalanceInfo = createDeepEqualSelector(
  [
    getAaveBalance,
    state => selectors.core.data.eth.getErc20Rates(state, 'aave'),
    selectors.core.settings.getCurrency
  ],
  (aaveBalanceR, erc20RatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertAaveToFiat({
        value,
        fromUnit: 'WEI',
        toCurrency,
        rates
      }).value
    }

    return lift(transform)(aaveBalanceR, erc20RatesR, currencyR)
  }
)

export const getYfiBalanceInfo = createDeepEqualSelector(
  [
    getYfiBalance,
    state => selectors.core.data.eth.getErc20Rates(state, 'yfi'),
    selectors.core.settings.getCurrency
  ],
  (yfiBalanceR, erc20RatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertYfiToFiat({
        value,
        fromUnit: 'WEI',
        toCurrency,
        rates
      }).value
    }

    return lift(transform)(yfiBalanceR, erc20RatesR, currencyR)
  }
)

export const getUsdtBalanceInfo = createDeepEqualSelector(
  [
    getUsdtBalance,
    state => selectors.core.data.eth.getErc20Rates(state, 'usdt'),
    selectors.core.settings.getCurrency
  ],
  (usdtBalanceR, erc20RatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertUsdtToFiat({
        value,
        fromUnit: 'WEI',
        toCurrency,
        rates
      }).value
    }

    return lift(transform)(usdtBalanceR, erc20RatesR, currencyR)
  }
)

export const getWdgldBalanceInfo = createDeepEqualSelector(
  [
    getWdgldBalance,
    state => selectors.core.data.eth.getErc20Rates(state, 'wdgld'),
    selectors.core.settings.getCurrency
  ],
  (wdgldBalanceR, erc20RatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertWdgldToFiat({
        value,
        fromUnit: 'WEI',
        toCurrency,
        rates
      }).value
    }

    return lift(transform)(wdgldBalanceR, erc20RatesR, currencyR)
  }
)

export const getDotBalanceInfo = createDeepEqualSelector(
  [
    getDotBalance,
    selectors.core.data.dot.getRates,
    selectors.core.settings.getCurrency
  ],
  (dotBalanceR, dotRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertDotToFiat({
        value,
        fromUnit: 'PLANCK',
        toCurrency,
        rates
      }).value
    }

    return lift(transform)(dotBalanceR, dotRatesR, currencyR)
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
          // @ts-ignore
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
    getAaveBalanceInfo,
    getBchBalanceInfo,
    getBtcBalanceInfo,
    getDotBalanceInfo,
    getEthBalanceInfo,
    getPaxBalanceInfo,
    getXlmBalanceInfo,
    getYfiBalanceInfo,
    getFiatBalanceInfo,
    selectors.core.settings.getCurrency
  ],
  (
    aaveBalanceInfoR,
    btcBalanceInfoR,
    bchBalanceInfoR,
    dotBalanceInfoR,
    ethBalanceInfoR,
    paxBalanceInfoR,
    xlmBalanceInfoR,
    yfiBalanceInfoR,
    fiatBalanceInfoR,
    currency
  ) => {
    const transform = (
      aaveBalance,
      bchBalance,
      btcBalance,
      dotBalance,
      ethBalance,
      paxBalance,
      xlmBalance,
      yfiBalance,
      fiatBalance,
      currency
    ) => {
      const total = formatFiat(
        Number(aaveBalance) +
          Number(btcBalance) +
          Number(dotBalance) +
          Number(ethBalance) +
          Number(bchBalance) +
          Number(paxBalance) +
          Number(xlmBalance) +
          Number(yfiBalance) +
          Number(fiatBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance }
    }
    return lift(transform)(
      aaveBalanceInfoR,
      bchBalanceInfoR,
      btcBalanceInfoR,
      dotBalanceInfoR,
      ethBalanceInfoR,
      paxBalanceInfoR,
      xlmBalanceInfoR,
      yfiBalanceInfoR,
      fiatBalanceInfoR,
      currency
    )
  }
)

export const getBalanceSelector = (coin: WalletCurrencyType) => {
  switch (coin) {
    case 'AAVE':
      return getAaveBalance
    case 'ALGO':
      return getAlgoBalance
    case 'BCH':
      return getBchBalance
    case 'BTC':
      return getBtcBalance
    case 'DOT':
      return getDotBalance
    case 'ETH':
      return getEthBalance
    case 'EUR':
    case 'GBP':
    case 'USD':
      return getFiatBalance(coin)
    case 'PAX':
      return getPaxBalance
    case 'XLM':
      return getXlmBalance
    case 'USDT':
      return getUsdtBalance
    case 'WDGLD':
      return getWdgldBalance
    case 'YFI':
      return getYfiBalance
    default:
      return Remote.Failure(INVALID_COIN_TYPE)
  }
}

export const getAllCoinsBalancesSelector = state => {
  return {
    AAVE: getAaveBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf(),
    ALGO: getAlgoBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf(),
    BCH: new BigNumber(getBchBalance(state).getOrElse(0)).valueOf(),
    BTC: new BigNumber(getBtcBalance(state).getOrElse(0)).valueOf(),
    DOT: getDotBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf(),
    ETH: getEthBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf(),
    PAX: getPaxBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf(),
    XLM: getXlmBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf(),
    USDT: getUsdtBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf(),
    WDGLD: getWdgldBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf(),
    YFI: getYfiBalance(state)
      .getOrElse(new BigNumber(0))
      .valueOf()
  }
}

export const getErc20BalancesInfo = createDeepEqualSelector(
  [
    getAaveBalanceInfo,
    getPaxBalanceInfo,
    getUsdtBalanceInfo,
    getWdgldBalanceInfo,
    getYfiBalanceInfo
  ],
  (
    aaveBalanceInfoR,
    paxBalanceInfoR,
    usdtBalanceInfoR,
    wdgldBalanceInfoR,
    yfiBalanceInfoR
  ) => {
    const transform = (
      aaveBalance,
      paxBalance,
      usdtBalance,
      wdgldBalance,
      yfiBalance
    ) => {
      return (
        Number(aaveBalance) +
        Number(paxBalance) +
        Number(usdtBalance) +
        Number(wdgldBalance) +
        Number(yfiBalance)
      )
    }
    return lift(transform)(
      aaveBalanceInfoR,
      paxBalanceInfoR,
      usdtBalanceInfoR,
      wdgldBalanceInfoR,
      yfiBalanceInfoR
    )
  }
)
