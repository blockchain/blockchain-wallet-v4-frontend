import BigNumber from 'bignumber.js'
import {
  add,
  curry,
  flatten,
  head,
  last,
  lift,
  map,
  not,
  pathOr,
  reduce,
  reject,
  toPairs
} from 'ramda'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import {
  CoinfigType,
  ExtractSuccess,
  InterestAccountBalanceType,
  RatesType,
  RemoteDataType,
  SBBalancesType,
  SBBalanceType,
  SwapOrderType,
  WalletFiatEnum,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { DEFAULT_SB_BALANCE } from 'data/components/simpleBuy/model'
import { getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'

import {
  getErc20NonCustodialBalance,
  getEthBalance as getEthNonCustodialBalance,
  getXlmBalance as getXlmNonCustodialBalance
} from './nonCustodial/selectors'

export const getCoinCustodialBalance = (
  coin: string
): ((state: RootState) => RemoteDataType<string, BigNumber>) =>
  createDeepEqualSelector(
    [
      selectors.components.simpleBuy.getSBBalances,
      selectors.components.interest.getInterestAccountBalance
    ],
    (
      sbBalancesR: RemoteDataType<string, SBBalancesType>,
      interestAccountBalanceR: RemoteDataType<string, InterestAccountBalanceType>
    ) => {
      const sbCoinBalance = sbBalancesR.getOrElse({
        [coin]: DEFAULT_SB_BALANCE
      })[coin]
      const interestCoinBalance = interestAccountBalanceR.getOrElse({
        [coin]: { balance: '0' } as InterestAccountBalanceType[typeof coin]
      })[coin]
      const sbBalance = sbCoinBalance ? sbCoinBalance.available : '0'
      const interestBalance = interestCoinBalance ? interestCoinBalance.balance : '0'

      return Remote.of(new BigNumber(sbBalance).plus(new BigNumber(interestBalance)))
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
      return walletBalances.concat(custodialBalance.toNumber())
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
      return walletBalances.concat(custodialBalance.toNumber())
    }
    const balancesR = lift(contextToBalances)(Remote.of(context), addressesR, custodialBalanceR)
    return balancesR.map(reduce<number, number>(add, 0))
  }
)

export const getEthBalance = createDeepEqualSelector(
  [getEthNonCustodialBalance, getCoinCustodialBalance('ETH')],
  (balancesR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(new BigNumber(0))

    return Remote.of(new BigNumber(balancesR.getOrElse(new BigNumber(0))).plus(custodialBalance))
  }
)

export const getErc20Balance = (coin: string) =>
  createDeepEqualSelector(
    [getErc20NonCustodialBalance(coin), getCoinCustodialBalance(coin)],
    (balanceR, custodialBalanceR) => {
      const custodialBalance = custodialBalanceR.getOrElse(new BigNumber(0))

      return Remote.of(new BigNumber(balanceR.getOrElse(0)).plus(custodialBalance))
    }
  )

export const getXlmBalance = createDeepEqualSelector(
  [getXlmNonCustodialBalance, getCoinCustodialBalance('XLM')],
  (balanceR, custodialBalanceR) => {
    const custodialBalance = custodialBalanceR.getOrElse(new BigNumber(0))

    return Remote.of(new BigNumber(balanceR.getOrElse(0)).plus(custodialBalance))
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

export const getBalanceSelector = (coin: string) => {
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
          return Exchange.convertCoinToFiat({ coin, currency, rates, value: balance })
        }

        const balanceR = getBalanceSelector(coin)(state)
        const ratesR = selectors.core.data.coins.getRates(coin, state)
        return ratesR ? lift(transform2)(ratesR, balanceR) : Remote.of('0')
      })
    }

    return lift(transform)(currencyR)
  }
)

export const getFiatBalanceInfo = createDeepEqualSelector(
  [
    selectors.core.data.coins.getBtcTicker,
    selectors.core.settings.getCurrency,
    selectors.components.simpleBuy.getSBBalances
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

      return balances.reduce(add, 0)
    }

    return lift(transform)(btcRatesR, currencyR, sbBalancesR)
  }
)

export const getAllCoinsBalancesSelector = (state) => {
  return selectors.core.data.coins.getAllCoins().reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: getBalanceSelector(curr)(state).getOrElse(new BigNumber(0)).valueOf()
    }
  }, {})
}

export const getCoinsSortedByBalance = createDeepEqualSelector(
  [
    selectors.custodial.getRecentSwapTxs,
    selectors.components.utils.getCoinsWithBalanceOrMethod,
    getAllCoinsBalancesSelector,
    (state: RootState) => state
  ],
  (recentSwapTxsR, coinsR, balances, state: RootState) => {
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
          value: balances[coinA]
        })
        const coinBFiat = Exchange.convertCoinToFiat({
          coin: coinB,
          currency,
          rates: ratesB,
          value: balances[coinB]
        })

        return Number(coinAFiat) > Number(coinBFiat) ? -1 : 1
      }

      // returns all fiats that user is currently eligible for
      // @ts-ignore
      const fiatList = reject(
        not,
        map((coin) => {
          if (coin.coinCode in WalletFiatEnum && coin.method === true) {
            return coin.coinfig
          }
        }, coins)
      )

      // returns all coins with balances as a list
      const cryptoList = map(
        (coin) => coins.find((c) => c.coinfig.symbol === coin),
        reject(
          not,
          map((x) => last(x) !== '0' && head(x), toPairs(balances))
        )
      ).map((coin) => coin?.coinfig)

      // list of fiats eligible and then coins with balances as single list
      const coinsWithBalance = [...fiatList, ...cryptoList]
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
