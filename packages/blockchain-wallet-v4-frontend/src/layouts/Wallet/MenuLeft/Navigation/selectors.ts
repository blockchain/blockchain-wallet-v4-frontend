import BigNumber from 'bignumber.js'
import { head, last, lift, map, not, reject, toPairs } from 'ramda'

import {
  CoinType,
  ExtractSuccess,
  SupportedCoinType,
  SupportedWalletCurrencyType,
  WalletFiatEnum
} from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { getAllCoinsBalancesSelector, getErc20Balance } from 'components/Balances/selectors'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = createDeepEqualSelector(
  [
    selectors.components.utils.getSupportedCoinsWithMethodAndOrder,
    getAllCoinsBalancesSelector,
    (state: RootState) => state
  ],
  (coinsR, balances, state: RootState) => {
    const transform = (coins: ExtractSuccess<typeof coinsR>) => {
      // returns all fiats that user is currently eligible for
      // @ts-ignore
      const fiatList = reject(
        not,
        map((coin) => {
          if (coin.coinCode in WalletFiatEnum && coin.method === true) {
            return coin
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
      )

      const erc20List = coins.reduce((acc, coin: SupportedWalletCurrencyType) => {
        if (!(coin as SupportedCoinType).contractAddress) return acc
        const balance: BigNumber = getErc20Balance(coin.coinCode as CoinType)(state).getOrElse(
          new BigNumber(0)
        )
        if (balance.isEqualTo(0)) {
          return [...acc]
        }
        return [...acc, coin]
      }, [] as SupportedWalletCurrencyType[])

      // returns list of fiats eligible and then cryptos with balances as single list
      return [...fiatList, ...cryptoList, ...erc20List] as Array<SupportedCoinType>
    }

    return lift(transform)(coinsR)
  }
)

export default getData
