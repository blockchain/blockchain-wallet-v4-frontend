// import { lift } from 'ramda'

// import type { DexTokenWithBalance } from '@core/network/api/dex'
// import { ExtractSuccess } from '@core/types'
// import { selectors } from 'data'
// import { RootState } from 'data/rootReducer'

// export const getRemote = (state: RootState) => {
//   const tokenListR = selectors.components.dex.getChainTokens(state)
//   const coins = selectors.core.data.coins.getCoins()

//   return lift((tokenList: ExtractSuccess<typeof tokenListR>): (DexTokenWithBalance | null)[] => {
//     return tokenList
//       .map((token: DexTokenWithBalance) => {
//         const coin = coins[token.symbol]
//         if (!coin) return null

//         const balance = selectors.balances
//           .getCoinNonCustodialBalance(coin.coinfig.symbol)(state)
//           .getOrElse(0)

//         return {
//           balance,
//           ...token
//         }
//       })
//       .filter((token) => token !== null)
//   })(tokenListR)
// }
