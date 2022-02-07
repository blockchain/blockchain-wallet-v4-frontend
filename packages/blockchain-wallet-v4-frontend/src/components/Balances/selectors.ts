import BigNumber from 'bignumber.js'
import { add, curry, flatten, lift, map, pathOr, reduce, reject } from 'ramda'

import { Exchange, Remote } from '@core'
import {
  BSBalancesType,
  BSBalanceType,
  CoinfigType,
  ExtractSuccess,
  InterestAccountBalanceType,
  RatesType,
  RemoteDataType,
  SwapOrderType,
  WalletFiatEnum,
  WalletFiatType
} from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { DEFAULT_BS_BALANCE } from 'data/components/buySell/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'

import {
  getErc20NonCustodialBalance,
  getEthBalance as getEthNonCustodialBalance,
  getXlmBalance as getXlmNonCustodialBalance
} from './nonCustodial/selectors'

export const getCoinCustodialBalance = (
  coin: string
): ((state: RootState) => RemoteDataType<string, number>) =>
  createDeepEqualSelector(
    [
      selectors.components.buySell.getBSBalances,
      selectors.components.interest.getInterestAccountBalance
    ],
    (
      sbBalancesR: RemoteDataType<string, BSBalancesType>,
      interestAccountBalanceR: RemoteDataType<string, InterestAccountBalanceType>
    ) => {
      const sbCoinBalance = sbBalancesR.getOrElse({
        [coin]: DEFAULT_BS_BALANCE
      })[coin]
      const interestCoinBalance = interestAccountBalanceR.getOrElse({
        [coin]: { balance: '0' } as InterestAccountBalanceType[typeof coin]
      })[coin]
      const sbBalance = sbCoinBalance ? sbCoinBalance.available : '0'
      const interestBalance = interestCoinBalance ? interestCoinBalance.balance : '0'

      return Remote.of(new BigNumber(sbBalance).plus(new BigNumber(interestBalance)).toNumber())
    }
  )

export const getBtcBalance = createDeepEqualSelector(
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

export const getBchBalance = createDeepEqualSelector(
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

export const getEthBalance = createDeepEqualSelector(
  [getEthNonCustodialBalance, getCoinCustodialBalance('ETH')],
  (balancesR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(0)

    return Remote.of(
      new BigNumber(balancesR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
    )
  }
)

export const getErc20Balance = (coin: string) =>
  createDeepEqualSelector(
    [getErc20NonCustodialBalance(coin), getCoinCustodialBalance(coin)],
    (balanceR, custodialBalanceR) => {
      const custodialBalance = custodialBalanceR.getOrElse(0)

      return Remote.of(
        new BigNumber(balanceR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
      )
    }
  )

export const getXlmBalance = createDeepEqualSelector(
  [getXlmNonCustodialBalance, getCoinCustodialBalance('XLM')],
  (balanceR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(0)

    return Remote.of(
      new BigNumber(balanceR.getOrElse(new BigNumber(0))).plus(custodialBalance).toNumber()
    )
  }
)

export const getFiatBalance = curry(
  (currency: WalletFiatType, state: RootState): RemoteDataType<string, number> => {
    const sbBalancesR = selectors.components.buySell.getBSBalances(state)
    const fiatBalance =
      sbBalancesR.getOrElse({
        [currency]: DEFAULT_BS_BALANCE
      })[currency]?.available || '0'
    return Remote.of(new BigNumber(convertBaseToStandard('FIAT', fiatBalance)).toNumber())
  }
)

export const getWithdrawableFiatBalance = curry(
  (
    currency: WalletFiatType,
    state: RootState
  ): RemoteDataType<string, BSBalanceType['withdrawable']> => {
    const sbBalancesR = selectors.components.buySell.getBSBalances(state)
    const fiatBalance =
      sbBalancesR.getOrElse({
        [currency]: DEFAULT_BS_BALANCE
      })[currency]?.withdrawable || '0'
    return Remote.of(fiatBalance)
  }
)

export const getBalanceSelector = (
  coin: string
): ((state: RootState) => RemoteDataType<any, number>) => {
  switch (coin) {
    case 'BCH':
      return getBchBalance
    case 'BTC':
      return getBtcBalance
    case 'ETH':
      return getEthBalance
    case 'XLM':
      return getXlmBalance
    case 'EUR':
    case 'GBP':
    case 'USD':
      return getFiatBalance(coin)
    default:
      switch (true) {
        case selectors.core.data.coins.getCustodialCoins().includes(coin):
          return getCoinCustodialBalance(coin)
        default:
          return getErc20Balance(coin)
      }
  }
}

export const getCoinsBalanceInfo = createDeepEqualSelector(
  [selectors.core.data.coins.getAllCoins, selectors.core.settings.getCurrency, (state) => state],
  (coins, currencyR, state) => {
    const transform = (currency) => {
      return coins.map((coin) => {
        const transform2 = (rates, balance) => {
          if (!rates.price) return 0
          return Exchange.convertCoinToFiat({ coin, currency, rates, value: balance })
        }

        const balanceR = getBalanceSelector(coin)(state)
        const ratesR = selectors.core.data.coins.getRates(coin, state)
        return lift(transform2)(ratesR, balanceR)
      })
    }

    return lift(transform)(currencyR)
  }
)

export const getFiatBalanceInfo = createDeepEqualSelector(
  [
    selectors.core.data.coins.getBtcTicker,
    selectors.core.settings.getCurrency,
    selectors.components.buySell.getBSBalances
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

export const getCoinsSortedByBalance = createDeepEqualSelector(
  [
    selectors.custodial.getRecentSwapTxs,
    selectors.components.utils.getCoinsWithBalanceOrMethod,
    (state: RootState) => state
  ],
  (recentSwapTxsR, coinsR, state: RootState) => {
    const transform = (coins: ExtractSuccess<typeof coinsR>) => {
      const coinSort = (a?: CoinfigType, b?: CoinfigType) => {
        if (!a || !b) return -1
        if (window.coins[a.symbol].coinfig.type.name === 'FIAT') return -1
        if (window.coins[b.symbol].coinfig.type.name === 'FIAT') return -1

        const coinA = a.symbol
        const coinB = b.symbol
        // doesnt really matter
        const currency = 'USD'

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
          value: getBalanceSelector(coinA)(state).getOrElse(0).valueOf()
        })
        const coinBFiat = Exchange.convertCoinToFiat({
          coin: coinB,
          currency,
          rates: ratesB,
          value: getBalanceSelector(coinB)(state).getOrElse(0).valueOf()
        })

        return Number(coinAFiat) > Number(coinBFiat) ? -1 : 1
      }

      // returns all coins with balances as a list
      const coinsWithBalance = map(
        (coin) => coins.find((c) => c.coinfig.symbol === coin),
        reject(
          (coin) =>
            getBalanceSelector(coin)(state).getOrElse(0) <= 0 &&
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

    return lift(transform)(coinsR)
  }
)
