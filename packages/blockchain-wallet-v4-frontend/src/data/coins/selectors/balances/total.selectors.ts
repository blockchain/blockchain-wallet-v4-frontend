/* eslint-disable @typescript-eslint/no-use-before-define */
import BigNumber from 'bignumber.js'
import { add, flatten, lift, map, pathOr, reduce, reject } from 'ramda'

import { Exchange, Remote } from '@core'
import { fiatToString } from '@core/exchange/utils'
import { SwapOrderType } from '@core/network/api/swap/types'
import { getBalance } from '@core/redux/data/coins/selectors'
import { RatesType } from '@core/redux/data/misc/types'
import { CoinfigType } from '@core/redux/walletOptions/types'
import { ExtractSuccess, RemoteDataType } from '@core/remote/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import {
  getCoinCustodialBalance,
  getErc20NonCustodialBalance,
  getEthNonCustodialBalance,
  getFiatBalance,
  getFiatBalanceInfo,
  getXlmNonCustodialBalance
} from 'data/coins/selectors'
import { getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'

const getCoinTotalBalance = createDeepEqualSelector(
  [selectors.core.data.coins.getAllCoins, selectors.core.settings.getCurrency, (state) => state],
  (coins, currencyR, state) => {
    const transform = (currency) => {
      return coins.map((coin) => {
        const transform2 = (rates, balance) => {
          if (!rates.price) return 0
          return Exchange.convertCoinToFiat({ coin, currency, rates, value: balance })
        }

        const balanceR = __getBalanceSelector(coin)(state)
        const ratesR = selectors.core.data.coins.getRates(coin, state)
        return lift(transform2)(ratesR, balanceR)
      })
    }

    return lift(transform)(currencyR)
  }
)

const getTotalWalletBalance = createDeepEqualSelector(
  [
    getFiatBalanceInfo,
    getCoinTotalBalance,
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
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

const getTotalWalletBalancesSorted = createDeepEqualSelector(
  [
    selectors.custodial.getRecentSwapTxs,
    selectors.components.utils.getCoinsWithBalanceOrMethod,
    selectors.core.settings.getCurrency,
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

        const ratesA = selectors.core.data.misc
          .getRatesSelector(coinA, state)
          .getOrElse(defaultRate as RatesType)
        const ratesB = selectors.core.data.misc
          .getRatesSelector(coinB, state)
          .getOrElse(defaultRate as RatesType)

        const coinAFiat = Exchange.convertCoinToFiat({
          coin: coinA,
          currency,
          rates: ratesA,
          value: __getBalanceSelector(coinA)(state).getOrElse(0).valueOf()
        })
        const coinBFiat = Exchange.convertCoinToFiat({
          coin: coinB,
          currency,
          rates: ratesB,
          value: __getBalanceSelector(coinB)(state).getOrElse(0).valueOf()
        })

        return Number(coinAFiat) > Number(coinBFiat) ? -1 : 1
      }

      // returns all coins with balances as a list
      const coinsWithBalance = map(
        (coin) => coins.find((c) => c.coinfig.symbol === coin),
        reject(
          (coin) =>
            __getBalanceSelector(coin)(state).getOrElse(0) <= 0 &&
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

const getBtcTotalBalance = createDeepEqualSelector(
  [
    selectors.core.wallet.getSpendableContext,
    selectors.core.data.btc.getAddresses,
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

const getBchTotalBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getSpendableContext,
    selectors.core.data.bch.getAddresses,
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

// returns ETH total balances
const getEthTotalBalance = createDeepEqualSelector(
  [getEthNonCustodialBalance, getCoinCustodialBalance('ETH')],
  (balancesR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(0)

    return Remote.of(
      new BigNumber(balancesR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
    )
  }
)

// returns an array of ETH balances
// the first being non-custodial balances and the second being custodial balances
const getEthTotalBalances = createDeepEqualSelector(
  [getEthNonCustodialBalance, getCoinCustodialBalance('ETH')],
  (balancesR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(0)

    return Remote.of([new BigNumber(balancesR.getOrElse(new BigNumber(0))), custodialBalance])
  }
)

const getErc20TotalBalance = (coin: string) =>
  createDeepEqualSelector(
    [getErc20NonCustodialBalance(coin), getCoinCustodialBalance(coin)],
    (balanceR, custodialBalanceR) => {
      const custodialBalance = custodialBalanceR.getOrElse(0)

      return Remote.of(
        new BigNumber(balanceR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
      )
    }
  )

const getXlmTotalBalance = createDeepEqualSelector(
  [getXlmNonCustodialBalance, getCoinCustodialBalance('XLM')],
  (balanceR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(0)

    return Remote.of(
      new BigNumber(balanceR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
    )
  }
)

// internal utility method to locate correct selector for coin
// TODO: issue with wrong balances returned if coin is both custodial and dynamic self-custody.
const __getBalanceSelector = (
  coin: string
): ((state: RootState) => RemoteDataType<string, number>) => {
  switch (coin) {
    case 'BCH':
      return getBchTotalBalance
    case 'BTC':
      return getBtcTotalBalance
    case 'ETH':
      return getEthTotalBalance
    case 'XLM':
      return getXlmTotalBalance
    case 'EUR':
    case 'GBP':
    case 'USD':
    case 'ARS':
      return getFiatBalance(coin)
    default:
      switch (true) {
        case selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(coin):
          return getBalance(coin)
        case selectors.core.data.coins.getCustodialCoins().includes(coin):
          return getCoinCustodialBalance(coin)
        default:
          return getErc20TotalBalance(coin)
      }
  }
}

export {
  getBchTotalBalance,
  getBtcTotalBalance,
  getCoinTotalBalance,
  getErc20TotalBalance,
  getEthTotalBalance,
  getEthTotalBalances,
  getTotalWalletBalance,
  getTotalWalletBalancesSorted,
  getXlmTotalBalance
}
