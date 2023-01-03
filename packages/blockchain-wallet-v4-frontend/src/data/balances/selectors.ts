//
//         ,     \    /      ,
//        / \    )\__/(     / \
//       /   \  (_\  /_)   /   \
//  ____/_____\__\@  @/___/_____\_____
// |             |\../|               |
// |              \VV/                |
// | Within this file resides dragons |
// |       Thou art forewarned        |
// |__________________________________|
//  |    /\ /      \\       \ /\    |
//  |  /   V        ))       V   \  |
//  |/     `       //        '     \|
//  `              V                '
//

/* eslint-disable @typescript-eslint/no-use-before-define */
import BigNumber from 'bignumber.js'
import { add, curry, flatten, lift, map, pathOr, reduce, reject } from 'ramda'

import { coreSelectors, Exchange, Remote } from '@core'
import { fiatToString } from '@core/exchange/utils'
import { getBalance } from '@core/redux/data/coins/selectors'
import {
  BSBalancesType,
  BSBalanceType,
  CoinfigType,
  CoinType,
  EarnAccountBalanceResponseType,
  ExtractSuccess,
  FiatType,
  RatesType,
  RemoteDataType,
  SwapOrderType,
  WalletFiatEnum,
  WalletFiatType
} from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import { DEFAULT_BS_BALANCE } from 'data/components/buySell/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'

// these imports must be relative to avoid circular dependencies!
import {
  buySell as buySellSelectors,
  interest as interestSelectors,
  utils as utilSelectors
} from '../components/selectors'
import * as custodialSelectors from '../custodial/selectors'
import * as routerSelectors from '../router/selectors'
// these selectors need to be external to this file to avoid hoisting/initialization errors
import {
  __getBchNonCustodialBalance,
  __getBtcNonCustodialBalance,
  __getErc20NonCustodialBalance,
  __getEthNonCustodialBalance,
  __getXlmNonCustodialBalance
} from './selectors.utils'

// these functions are private as denoted by the '__' prefix but must be at the top of this
// file to avoid function hoisting issues. they also cannot be included in the external
// util file as that results in circular dependencies.

// gets all coins and returns the total balance in terms of wallet currency
const __getAllCoinsTotalBalance = createDeepEqualSelector(
  [coreSelectors.data.coins.getAllCoins, coreSelectors.settings.getCurrency, (state) => state],
  (coins, currencyR, state) => {
    const transform = (currency) => {
      return coins.map((coin) => {
        const transform2 = (rates, balance) => {
          if (!rates.price) return 0
          return Exchange.convertCoinToFiat({ coin, currency, rates, value: balance })
        }

        const balanceR = getCoinTotalBalance(coin)(state)
        const ratesR = coreSelectors.data.coins.getRates(coin, state)
        return lift(transform2)(ratesR, balanceR)
      })
    }

    return lift(transform)(currencyR)
  }
)

// gets balance info for a fiat currency
const __getFiatCurrencyBalanceInfo = createDeepEqualSelector(
  [
    coreSelectors.data.coins.getBtcTicker,
    coreSelectors.settings.getCurrency,
    buySellSelectors.getBSBalances
  ],
  (btcRatesR, currencyR, sbBalancesR) => {
    const transform = (
      rates: ExtractSuccess<typeof btcRatesR>,
      currency,
      sbBalances: ExtractSuccess<typeof sbBalancesR>
    ) => {
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

      // @ts-ignore
      return balances.reduce(add, 0)
    }

    return lift(transform)(btcRatesR, currencyR, sbBalancesR)
  }
)

//
// PUBLIC SELECTORS
//

// given a fiat currency, returns the total balance
export const getFiatCurrencyBalance = curry(
  (currency: WalletFiatType, state: RootState): RemoteDataType<string, number> => {
    const sbBalancesR = buySellSelectors.getBSBalances(state)
    const fiatBalance =
      sbBalancesR.getOrElse({
        [currency]: DEFAULT_BS_BALANCE
      })[currency]?.available || '0'
    return Remote.of(new BigNumber(convertBaseToStandard('FIAT', fiatBalance)).toNumber())
  }
)

// given a fiat currency, returns its withdrawable balance
export const getFiatCurrencyWithdrawableBalance = curry(
  (
    currency: WalletFiatType,
    state: RootState
  ): RemoteDataType<string, BSBalanceType['withdrawable']> => {
    const sbBalancesR = buySellSelectors.getBSBalances(state)
    const fiatBalance =
      sbBalancesR.getOrElse({
        [currency]: DEFAULT_BS_BALANCE
      })[currency]?.withdrawable || '0'
    return Remote.of(fiatBalance)
  }
)

// given a coin, returns its trading account balance
export const getCoinTradingBalance = (coin: CoinType, state) => {
  return buySellSelectors.getBSBalances(state).map((x) => x[coin])
}

// given a coin, returns its interest account balance
export const getCoinInterestBalance = (coin: CoinType, state) => {
  return interestSelectors.getPassiveRewardsAccountBalance(state).map((x) => x[coin])
}

// given a coin, returns its custodial balance
export const getCoinCustodialBalance = (
  coin: string
): ((state: RootState) => RemoteDataType<string, number>) =>
  createDeepEqualSelector(
    [
      buySellSelectors.getBSBalances,
      interestSelectors.getPassiveRewardsAccountBalance,
      interestSelectors.getStakingAccountBalance,
      interestSelectors.getActiveRewardsAccountBalance
    ],
    (
      sbBalancesR: RemoteDataType<PartialClientErrorProperties, BSBalancesType>,
      passiveRewardsAccountBalanceR: RemoteDataType<string, EarnAccountBalanceResponseType>,
      stakingAccountBalanceR: RemoteDataType<string, EarnAccountBalanceResponseType>,
      activeRewardsAccountBalanceR: RemoteDataType<string, EarnAccountBalanceResponseType>
    ) => {
      const sbCoinBalance = sbBalancesR.getOrElse({
        [coin]: DEFAULT_BS_BALANCE
      })[coin]
      const interestCoinBalance = passiveRewardsAccountBalanceR.getOrElse({
        [coin]: { balance: '0' } as EarnAccountBalanceResponseType[typeof coin]
      })[coin]
      const stakingCoinBalance = stakingAccountBalanceR.getOrElse({
        [coin]: { balance: '0' } as EarnAccountBalanceResponseType[typeof coin]
      })[coin]
      const activeRewardsCoinBalance = activeRewardsAccountBalanceR.getOrElse({
        [coin]: { balance: '0' } as EarnAccountBalanceResponseType[typeof coin]
      })[coin]
      const sbBalance = sbCoinBalance ? sbCoinBalance.available : '0'
      const interestBalance = interestCoinBalance ? interestCoinBalance.balance : '0'
      const stakingBalance = stakingCoinBalance ? stakingCoinBalance.balance : '0'
      const activeRewardsBalance = activeRewardsCoinBalance ? activeRewardsCoinBalance.balance : '0'
      return Remote.of(
        new BigNumber(sbBalance)
          .plus(new BigNumber(interestBalance))
          .plus(new BigNumber(stakingBalance))
          .plus(new BigNumber(activeRewardsBalance))
          .toNumber()
      )
    }
  )

// given a coin or currency, will return its total balance across all account types
export const getCoinTotalBalance = (
  coin: CoinType | FiatType
): ((state: RootState) => RemoteDataType<string, number>) => {
  switch (coin) {
    case 'BCH':
      return __getBchTotalBalance
    case 'BTC':
      return __getBtcTotalBalance
    case 'ETH':
      return __getEthTotalBalance
    case 'XLM':
      return __getXlmTotalBalance
    case 'EUR':
    case 'GBP':
    case 'USD':
    case 'ARS':
      return getFiatCurrencyBalance(coin)
    default:
      switch (true) {
        case coreSelectors.data.coins.getDynamicSelfCustodyCoins().includes(coin):
          return __getDynamicSelfCustodyTotalBalance(coin)
        case coreSelectors.data.coins.getCustodialCoins().includes(coin):
          return getCoinCustodialBalance(coin)
        case !!window.coins[coin].coinfig.type.erc20Address:
          return __getErc20TotalBalance(coin)
        default:
          // coin not supported by wallet, just return 0 value
          return () => Remote.Success(0)
      }
  }
}

// returns the total balance of the wallet in terms of wallet fiat currency setting
export const getTotalWalletBalance = createDeepEqualSelector(
  [
    __getFiatCurrencyBalanceInfo,
    __getAllCoinsTotalBalance,
    coreSelectors.settings.getCurrency,
    routerSelectors.getPathname
  ],
  (fiatBalanceInfoR, coinsBalanceInfo, currency, path) => {
    const transform = (fiatBalance, coinsBalanceInfo, currency) => {
      const balanceReducer = (acc, cur) => acc + Number(cur.getOrElse('0'))
      const coinsBalance = coinsBalanceInfo.reduce(balanceReducer, 0)
      const total = Number(fiatBalance) + coinsBalance
      const totalBalance = `${fiatToString({ unit: currency, value: total })}`
      return { path, totalBalance }
    }

    return lift(transform)(fiatBalanceInfoR, coinsBalanceInfo, currency)
  }
)

// returns the total balance of the wallet in terms of wallet fiat currency setting
export const getTotalWalletBalanceNotFormatted = createDeepEqualSelector(
  [__getFiatCurrencyBalanceInfo, __getAllCoinsTotalBalance, routerSelectors.getPathname],
  (fiatBalanceInfoR, coinsBalanceInfo) => {
    const transform = (fiatBalance, coinsBalanceInfo) => {
      const balanceReducer = (acc, cur) => acc + Number(cur.getOrElse('0'))
      const coinsBalance = coinsBalanceInfo.reduce(balanceReducer, 0)
      const total = Number(fiatBalance) + coinsBalance
      return { total }
    }

    return lift(transform)(fiatBalanceInfoR, coinsBalanceInfo)
  }
)

// returns the total coin balances of the wallet sorted by coin balance
export const getTotalWalletBalancesSorted = createDeepEqualSelector(
  [
    custodialSelectors.getRecentSwapTxs,
    utilSelectors.getCoinsWithBalanceOrMethod,
    coreSelectors.settings.getCurrency,
    (state: RootState) => state
  ],
  (recentSwapTxsR, coinsR, currencyR, state: RootState) => {
    const transform = (coins: ExtractSuccess<typeof coinsR>, currency) => {
      const coinSort = (a?: CoinfigType, b?: CoinfigType) => {
        if (!a || !b) return -1
        if (window.coins[a.symbol].coinfig.type.name === 'FIAT') return -1
        if (window.coins[b.symbol].coinfig.type.name === 'FIAT') return -1

        const coinA = a.symbol
        const coinB = b.symbol
        const defaultRate = { price: 1 }

        const ratesA = coreSelectors.data.misc
          .getRatesSelector(coinA, state)
          .getOrElse(defaultRate as RatesType)
        const ratesB = coreSelectors.data.misc
          .getRatesSelector(coinB, state)
          .getOrElse(defaultRate as RatesType)

        const coinAFiat = Exchange.convertCoinToFiat({
          coin: coinA,
          currency,
          rates: ratesA,
          value: getCoinTotalBalance(coinA)(state).getOrElse(0).valueOf()
        })
        const coinBFiat = Exchange.convertCoinToFiat({
          coin: coinB,
          currency,
          rates: ratesB,
          value: getCoinTotalBalance(coinB)(state).getOrElse(0).valueOf()
        })

        return Number(coinAFiat) > Number(coinBFiat) ? -1 : 1
      }

      // returns all coins with balances as a list
      const coinsWithBalance = map(
        (coin) => coins.find((c) => c.coinfig.symbol === coin),
        reject(
          (coin) =>
            getCoinTotalBalance(coin)(state).getOrElse(0) <= 0 &&
            window.coins[coin].coinfig.type.name !== 'FIAT' &&
            coin !== 'BTC',
          Object.keys(window.coins)
        )
      )
        .map((coin) => coin?.coinfig)
        .filter(Boolean)

      const coinsInRecentSwaps = [
        ...new Set(
          recentSwapTxsR.getOrElse([] as SwapOrderType[]).map((tx) => getOutputFromPair(tx.pair))
        )
      ]

      const coinsWithoutBalanceToTrack = coinsInRecentSwaps
        .filter((coin) => !coinsWithBalance.find((coinfig) => coinfig?.symbol === coin))
        .filter((coin) => window.coins[coin])
        .map((coin) => window.coins[coin].coinfig)

      // list of coins with balance and then coins w/ no balance but swaps
      return [...coinsWithBalance, ...coinsWithoutBalanceToTrack].sort(coinSort) as CoinfigType[]
    }

    return lift(transform)(coinsR, currencyR)
  }
)

// given a coin, returns its non-custodial balance
export const getCoinNonCustodialBalance = (
  coin: CoinType
): ((state: RootState) => RemoteDataType<string, number | BigNumber>) => {
  switch (true) {
    case coin === 'BTC':
      return __getBtcNonCustodialBalance
    case coin === 'BCH':
      return __getBchNonCustodialBalance
    case coin === 'ETH':
      return __getEthNonCustodialBalance
    case coin === 'XLM':
      return __getXlmNonCustodialBalance
    case !!window.coins[coin].coinfig.type.erc20Address:
      return __getErc20NonCustodialBalance(coin)
    default:
      throw Error(`Coin "${coin}" not supported by getCoinNonCustodialBalance`)
  }
}

// given a coin, return its balances separated as a list [non-custodial, custodial]
export const getCoinBalancesTypeSeparated = (coin) =>
  createDeepEqualSelector(
    [getCoinNonCustodialBalance(coin), getCoinCustodialBalance(coin)],
    (nonCustodialBalancesR, custodialBalanceR) => {
      return Remote.of([
        // @ts-ignore
        new BigNumber(nonCustodialBalancesR.getOrElse(new BigNumber(0))),
        // @ts-ignore
        custodialBalanceR.getOrElse(0)
      ])
    }
  )

//
// INTERNAL SELECTORS, DO NOT USE OUTSIDE OF THIS FILE!
//

// returns BTC total balance
const __getBtcTotalBalance = createDeepEqualSelector(
  [
    coreSelectors.wallet.getSpendableContext,
    coreSelectors.data.btc.getAddresses,
    getCoinCustodialBalance('BTC')
  ],
  (context, addressesR, custodialBalanceR) => {
    const contextToBalances = (
      context,
      balances,
      custodialBalance: ExtractSuccess<typeof custodialBalanceR>
    ): Array<number> => {
      const walletBalances: Array<number> = flatten(context).map((a) =>
        pathOr(0, [a, 'final_balance'], balances)
      )
      return walletBalances.concat(custodialBalance)
    }
    const balancesR = lift(contextToBalances)(Remote.of(context), addressesR, custodialBalanceR)
    return balancesR.map(reduce<number, number>(add, 0))
  }
)

// returns BCH total balance
const __getBchTotalBalance = createDeepEqualSelector(
  [
    coreSelectors.kvStore.bch.getSpendableContext,
    coreSelectors.data.bch.getAddresses,
    getCoinCustodialBalance('BCH')
  ],
  (context, addressesR, custodialBalanceR) => {
    const contextToBalances = (
      context,
      balances,
      custodialBalance: ExtractSuccess<typeof custodialBalanceR>
    ) => {
      const walletBalances: Array<number> = context.map((a) =>
        pathOr(0, [a, 'final_balance'], balances)
      )
      return walletBalances.concat(custodialBalance)
    }
    const balancesR = lift(contextToBalances)(Remote.of(context), addressesR, custodialBalanceR)
    return balancesR.map(reduce<number, number>(add, 0))
  }
)

// returns ETH total balance
const __getEthTotalBalance = createDeepEqualSelector(
  [getCoinNonCustodialBalance('ETH'), getCoinCustodialBalance('ETH')],
  (balancesR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(0)

    return Remote.of(
      new BigNumber(balancesR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
    )
  }
)

// given an erc20 coin, returns its total balances
const __getErc20TotalBalance = (coin: CoinType) =>
  createDeepEqualSelector(
    [getCoinNonCustodialBalance(coin), getCoinCustodialBalance(coin)],
    (balanceR, custodialBalanceR) => {
      const custodialBalance = custodialBalanceR.getOrElse(0)

      return Remote.of(
        new BigNumber(balanceR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
      )
    }
  )

// returns XLM total balances
const __getXlmTotalBalance = createDeepEqualSelector(
  [getCoinNonCustodialBalance('XLM'), getCoinCustodialBalance('XLM')],
  (balanceR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(0)

    return Remote.of(
      new BigNumber(balanceR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
    )
  }
)

// given a dynamic self custody coin, returns its total balances
const __getDynamicSelfCustodyTotalBalance = (coin: CoinType) =>
  createDeepEqualSelector(
    [getBalance(coin), getCoinCustodialBalance(coin)],
    (balanceR, custodialBalanceR) => {
      const custodialBalance = custodialBalanceR.getOrElse(0)

      return Remote.of(
        new BigNumber(balanceR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
      )
    }
  )
