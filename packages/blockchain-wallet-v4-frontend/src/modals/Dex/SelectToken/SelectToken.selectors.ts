import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { DexToken } from 'data/types'

export const getData = createDeepEqualSelector(
  [selectors.dex.getCurrentChainTokens, (state) => state],
  (tokenListR, state) => {
    const transform = (tokenList: ExtractSuccess<typeof tokenListR>) => {
      return tokenList.map((token: DexToken) => {
        const { coinfig } = window.coins[token.symbol]
        const balance = selectors.balances
          .getCoinNonCustodialBalance(coinfig.symbol)(state)
          .getOrElse(0)

        return {
          balance,
          ...coinfig
        }
      })
    }

    return lift(transform)(tokenListR)
  }
)
