import { lift } from 'ramda'

import type { DexToken, DexTokenWithBalance } from '@core/network/api/dex'
import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getDexTokensList = createDeepEqualSelector(
  [selectors.components.dex.getCurrentChainTokens, (state) => state],
  (tokenListR, state) => {
    const transform = (
      tokenList: ExtractSuccess<typeof tokenListR>
    ): (DexTokenWithBalance | null)[] => {
      return tokenList.map((token: DexToken) => {
        const coin = window.coins[token.symbol]
        if (!coin) return null

        const balance = selectors.balances
          .getCoinNonCustodialBalance(coin.coinfig.symbol)(state)
          .getOrElse(0)

        return {
          balance,
          ...token
        }
      })
    }

    return lift((list) => transform(list).filter((t): t is DexTokenWithBalance => !!t))(tokenListR)
  }
)
