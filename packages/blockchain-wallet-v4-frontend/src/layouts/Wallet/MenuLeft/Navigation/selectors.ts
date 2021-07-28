import { head, last, lift, map, not, reject, toPairs } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import {
  CoinfigType,
  ExtractSuccess,
  SwapOrderType,
  WalletFiatEnum
} from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { getAllCoinsBalancesSelector } from 'components/Balances/selectors'
import { selectors } from 'data'
import { getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'

export const getData = createDeepEqualSelector(
  [
    selectors.custodial.getRecentSwapTxs,
    selectors.components.utils.getCoinsWithMethodAndOrder,
    getAllCoinsBalancesSelector,
    (state: RootState) => state
  ],
  (recentSwapTxsR, coinsR, balances, state: RootState) => {
    const transform = (coins: ExtractSuccess<typeof coinsR>) => {
      const coinSort = (a?: CoinfigType, b?: CoinfigType) => {
        if (!a || !b) return -1
        if (window.coins[a.symbol].coinfig.type.isFiat) return 1
        if (window.coins[b.symbol].coinfig.type.isFiat) return 1

        const coinA = a.symbol
        const coinB = b.symbol
        // doesnt really matter
        const currency = 'USD'

        const defaultRate = 1

        const ratesA = selectors.core.data.misc
          .getRatesSelector(coinA, state)
          .getOrElse(defaultRate)
        const ratesB = selectors.core.data.misc
          .getRatesSelector(coinB, state)
          .getOrElse(defaultRate)

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
        .map((coin) => window.coins[coin].coinfig)

      // list of coins with balance and then coins w/ no balance but swaps
      return [...coinsWithBalance, ...coinsWithoutBalanceToTrack].sort(coinSort) as CoinfigType[]
    }

    return lift(transform)(coinsR)
  }
)

export default getData
