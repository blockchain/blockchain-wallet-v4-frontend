import { head, last, lift, map, not, reject, toPairs } from 'ramda'

import {
  ExtractSuccess,
  SupportedCoinType,
  WalletFiatEnum
} from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { getAllCoinsBalancesSelector } from 'components/Balances/selectors'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.utils.getSupportedCoinsWithMethodAndOrder,
    getAllCoinsBalancesSelector
  ],
  (coinsR, balances) => {
    const transform = (coins: ExtractSuccess<typeof coinsR>) => {
      // returns all fiats that user is currently eligible for
      // @ts-ignore
      const fiatList = reject(
        not,
        map(coin => {
          if (coin.coinCode in WalletFiatEnum && coin.method === true) {
            return coin
          }
        }, coins)
      )

      // returns all coins with balances as a list
      const cryptoList = map(
        coin => coins.find(c => c.coinCode === coin),
        reject(
          not,
          map(x => last(x) !== '0' && head(x), toPairs(balances))
        )
      )

      // returns list of fiats eligible and then cryptos with balances as single list
      return [...fiatList, ...cryptoList] as Array<SupportedCoinType>
    }

    return lift(transform)(coinsR)
  }
)
