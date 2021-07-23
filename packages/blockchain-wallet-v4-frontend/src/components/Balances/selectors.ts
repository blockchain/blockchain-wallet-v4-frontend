import BigNumber from 'bignumber.js'
import { add, curry, flatten, lift, pathOr, reduce } from 'ramda'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import {
  ExtractSuccess,
  InterestAccountBalanceType,
  RemoteDataType,
  SBBalancesType,
  SBBalanceType,
  WalletFiatEnum,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { DEFAULT_SB_BALANCE } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'

import {
  getErc20NonCustodialBalance,
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
      const walletBalances: Array<number> = flatten(context).map((a) =>
        pathOr(0, [a, 'final_balance'], balances)
      )
      const interestBalance = interestAccountBalance.BTC
        ? parseInt(interestAccountBalance.BTC.balance, 10)
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
      const walletBalances: Array<number> = context.map((a) =>
        pathOr(0, [a, 'final_balance'], balances)
      )
      const interestBalance = interestAccountBalance.BCH
        ? parseInt(interestAccountBalance.BCH.balance, 10)
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
      ETH: { balance: '0' } as InterestAccountBalanceType['ETH']
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

export const getErc20Balance = (coin: string) =>
  createDeepEqualSelector(
    [getErc20NonCustodialBalance(coin), selectors.components.simpleBuy.getSBBalances],
    (balanceR, sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
      const sbCoinBalance = sbBalancesR.getOrElse({
        [coin]: DEFAULT_SB_BALANCE
      })[coin]
      const sbBalance = sbCoinBalance ? sbCoinBalance.available : '0'

      return Remote.of(new BigNumber(balanceR.getOrElse(0)).plus(new BigNumber(sbBalance)))
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
      XLM: { balance: '0' } as InterestAccountBalanceType['XLM']
    }).XLM
    const interestBalance = interestXlmBalance ? interestXlmBalance.balance : '0'
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
    const sbAlgoBalance = sbBalancesR.getOrElse({ ALGO: DEFAULT_SB_BALANCE }).ALGO
    const sbBalance = sbAlgoBalance ? sbAlgoBalance.available : '0'

    return Remote.of(new BigNumber(sbBalance))
  }
)

export const getCloutBalance = createDeepEqualSelector(
  [selectors.components.simpleBuy.getSBBalances],
  (sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
    const sbCloutBalance = sbBalancesR.getOrElse({ CLOUT: DEFAULT_SB_BALANCE }).CLOUT
    const sbBalance = sbCloutBalance ? sbCloutBalance.available : '0'

    return Remote.of(new BigNumber(sbBalance))
  }
)

export const getDogeBalance = createDeepEqualSelector(
  [selectors.components.simpleBuy.getSBBalances],
  (sbBalancesR: RemoteDataType<string, SBBalancesType>) => {
    const sbDogeBalance = sbBalancesR.getOrElse({ DOGE: DEFAULT_SB_BALANCE }).DOGE
    const sbBalance = sbDogeBalance ? sbDogeBalance.available : '0'

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
  [getBtcBalance, selectors.core.data.btc.getRates, selectors.core.settings.getCurrency],
  (btcBalanceR, btcRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'BTC', currency: toCurrency, rates, value })
    return lift(transform)(btcBalanceR, btcRatesR, currencyR)
  }
)

export const getBchBalanceInfo = createDeepEqualSelector(
  [getBchBalance, selectors.core.data.bch.getRates, selectors.core.settings.getCurrency],
  (bchBalanceR, bchRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'BCH', currency: toCurrency, rates, value })
    return lift(transform)(bchBalanceR, bchRatesR, currencyR)
  }
)

export const getEthBalanceInfo = createDeepEqualSelector(
  [getEthBalance, selectors.core.data.eth.getRates, selectors.core.settings.getCurrency],
  (ethBalanceR, ethRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertCoinToFiat({ coin: 'ETH', currency: toCurrency, rates, value })
    }

    return lift(transform)(ethBalanceR, ethRatesR, currencyR)
  }
)

export const getDotBalanceInfo = createDeepEqualSelector(
  [getDotBalance, selectors.core.data.dot.getRates, selectors.core.settings.getCurrency],
  (dotBalanceR, dotRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) => {
      return Exchange.convertCoinToFiat({ coin: 'DOT', currency: toCurrency, rates, value })
    }

    return lift(transform)(dotBalanceR, dotRatesR, currencyR)
  }
)

export const getXlmBalanceInfo = createDeepEqualSelector(
  [getXlmBalance, selectors.core.data.xlm.getRates, selectors.core.settings.getCurrency],
  (xlmBalanceR, xlmRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'XLM', currency: toCurrency, rates, value })
    return lift(transform)(xlmBalanceR, xlmRatesR, currencyR)
  }
)

export const getAlgoBalanceInfo = createDeepEqualSelector(
  [getAlgoBalance, selectors.core.data.algo.getRates, selectors.core.settings.getCurrency],
  (algoBalanceR, algoRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'ALGO', currency: toCurrency, rates, value })
    return lift(transform)(algoBalanceR, algoRatesR, currencyR)
  }
)

export const getCloutBalanceInfo = createDeepEqualSelector(
  [getCloutBalance, selectors.core.data.clout.getRates, selectors.core.settings.getCurrency],
  (cloutBalanceR, cloutRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'CLOUT', currency: toCurrency, rates, value })
    return lift(transform)(cloutBalanceR, cloutRatesR, currencyR)
  }
)

export const getDogeBalanceInfo = createDeepEqualSelector(
  [getDogeBalance, selectors.core.data.doge.getRates, selectors.core.settings.getCurrency],
  (dogeBalanceR, dogeRatesR, currencyR) => {
    const transform = (value, rates, toCurrency) =>
      Exchange.convertCoinToFiat({ coin: 'DOGE', currency: toCurrency, rates, value })
    return lift(transform)(dogeBalanceR, dogeRatesR, currencyR)
  }
)

export const getFiatBalanceInfo = createDeepEqualSelector(
  [
    selectors.core.data.btc.getRates,
    selectors.core.settings.getCurrency,
    selectors.components.simpleBuy.getSBBalances
  ],
  (btcRatesR, currencyR, sbBalancesR) => {
    const transform = (rates, currency, sbBalances: ExtractSuccess<typeof sbBalancesR>) => {
      const keys = Object.keys(WalletFiatEnum).filter(
        (value) => typeof WalletFiatEnum[value] === 'number'
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
          fromCurrency: value,
          rates,
          toCurrency: currency,
          value: standard
        })
      })

      return balances.reduce(add, 0)
    }

    return lift(transform)(btcRatesR, currencyR, sbBalancesR)
  }
)

export const getBalanceSelector = (coin: string) => {
  switch (coin) {
    case 'ALGO':
      return getAlgoBalance
    case 'BCH':
      return getBchBalance
    case 'BTC':
      return getBtcBalance
    case 'CLOUT':
      return getCloutBalance
    case 'DOGE':
      return getDogeBalance
    case 'DOT':
      return getDotBalance
    case 'ETH':
      return getEthBalance
    case 'XLM':
      return getXlmBalance
    case 'EUR':
    case 'GBP':
    case 'USD':
      return getFiatBalance(coin)
    // TODO: FIX erc20 is default
    default:
      return getErc20Balance(coin)
  }
}

export const getAllCoinsBalancesSelector = (state) => {
  return Object.keys(window.coins).reduce(
    (acc, curr) => {
      if (window.coins[curr].coinfig.type.erc20Address) {
        return {
          ...acc,
          [curr]: getErc20Balance(curr)(state).getOrElse(new BigNumber(0)).valueOf()
        }
      }
      return { ...acc }
    },
    {
      ALGO: getAlgoBalance(state).getOrElse(new BigNumber(0)).valueOf(),
      BCH: new BigNumber(getBchBalance(state).getOrElse(0)).valueOf(),
      BTC: new BigNumber(getBtcBalance(state).getOrElse(0)).valueOf(),
      CLOUT: getCloutBalance(state).getOrElse(new BigNumber(0)).valueOf(),
      DOGE: getDogeBalance(state).getOrElse(new BigNumber(0)).valueOf(),
      DOT: getDotBalance(state).getOrElse(new BigNumber(0)).valueOf(),
      ETH: getEthBalance(state).getOrElse(new BigNumber(0)).valueOf(),
      XLM: getXlmBalance(state).getOrElse(new BigNumber(0)).valueOf()
    }
  )
}

export const getErc20BalancesInfoV2 = createDeepEqualSelector(
  [
    selectors.core.data.eth.getErc20AccountTokenBalances,
    selectors.core.data.eth.getErc20Rates,
    selectors.core.settings.getCurrency,
    (state) => state
  ],
  (erc20CoinsR, ratesF, currencyR, state) => {
    const transform = (erc20Coins, currency) => {
      return erc20Coins.map((erc20) => {
        const coin = erc20.symbol
        const transform2 = (balance, rates) => {
          return Exchange.convertCoinToFiat({ coin, currency, rates, value: balance })
        }
        const balanceR = getErc20Balance(coin)(state)
        // @ts-ignore
        const ratesR = ratesF(coin)
        return ratesR ? lift(transform2)(balanceR, ratesR) : Remote.of('0')
      })
    }

    return lift(transform)(erc20CoinsR, currencyR)
  }
)
