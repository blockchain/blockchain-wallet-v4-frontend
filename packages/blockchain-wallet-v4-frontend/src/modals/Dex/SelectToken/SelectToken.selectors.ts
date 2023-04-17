import { lift } from 'ramda'

import type { DexToken, DexTokenWithBalance } from '@core/network/api/dex'
import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getRemote = (state: RootState) => {
  const searchedTokensR = selectors.components.dex.getSearchedTokens(state)
  const tokenListR = selectors.components.dex.getCurrentChainTokens(state)
  const search = selectors.components.dex.getSearch(state)

  return lift(
    (
      searchedTokens: ExtractSuccess<typeof searchedTokensR>,
      tokenList: ExtractSuccess<typeof tokenListR>
    ): (DexTokenWithBalance | null)[] => {
      const list = search.length > 0 ? searchedTokens : tokenList
      return list.map((token: DexToken) => {
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
  )(searchedTokensR, tokenListR)
}
