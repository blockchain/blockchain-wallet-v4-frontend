import { lift } from 'ramda'

import type { DexToken } from '@core/network/api/dex'
import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getDexTokensList = createDeepEqualSelector(
  [selectors.components.dex.getCurrentChainTokens, (state) => state],
  (tokenListR, state) => {
    const transform = (tokenList: ExtractSuccess<typeof tokenListR>) => {
      return tokenList.map((token: DexToken) => {
        const { coinfig } = window.coins[token.symbol]
        const balance = selectors.balances
          .getCoinNonCustodialBalance(coinfig.symbol)(state)
          .getOrElse(0)

        return {
          balance,
          ...token
        }
      })
    }

    return lift(transform)(tokenListR)
  }
)
