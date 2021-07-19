import BigNumber from 'bignumber.js'
import { head, last, lift, map, not, reject, toPairs } from 'ramda'

import {
  CoinfigType,
  ExtractSuccess,
  SupportedWalletCurrencyType,
  SwapOrderType,
  WalletFiatEnum
} from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { getAllCoinsBalancesSelector, getErc20Balance } from 'components/Balances/selectors'
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
        (coin) => coins.find((c) => c.coinCode === coin),
        reject(
          not,
          map((x) => last(x) !== '0' && head(x), toPairs(balances))
        )
      ).map((coin) => coin?.coinfig)

      const erc20List = coins.reduce((acc, coin: SupportedWalletCurrencyType) => {
        if (!coin.coinfig.type.erc20Address) return acc
        const balance: BigNumber = getErc20Balance(coin.coinfig.symbol)(state).getOrElse(
          new BigNumber(0)
        )
        if (balance.isEqualTo(0)) {
          return [...acc]
        }
        return [...acc, coin.coinfig]
      }, [] as CoinfigType[])

      // list of fiats eligible and then coins with balances as single list
      const coinsWithBalance = [...fiatList, ...cryptoList, ...erc20List]
      const coinsInRecentSwaps = [
        ...new Set(
          recentSwapTxsR.getOrElse([] as SwapOrderType[]).map((tx) => getOutputFromPair(tx.pair))
        )
      ]
      const coinsWithoutBalanceToTrack = coinsInRecentSwaps
        .filter((coin) => !coinsWithBalance.find((coinfig) => coinfig?.symbol === coin))
        .map((coin) => window.coins[coin].coinfig)

      // list of coins with balance and then coins w/ no balance but swaps
      return [...coinsWithBalance, ...coinsWithoutBalanceToTrack] as CoinfigType[]
    }

    return lift(transform)(coinsR)
  }
)

export default getData
