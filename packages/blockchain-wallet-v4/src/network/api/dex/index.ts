import {
  buildDexTx,
  getDexChains,
  getDexChainTokens,
  getDexSwapQuote,
  getDexTokenAllowance,
  getDexUserEligibility,
  searchDexTokens
} from './requests'

export type { DexChain, DexSwapQuote, DexToken, DexTokenWithBalance } from './types'

export default ({ apiUrl, authorizedGet, authorizedPost, get, nabuUrl, post }) => {
  return {
    buildDexTx: buildDexTx({ apiUrl, authorizedPost }),
    getDexChainTokens: getDexChainTokens({ apiUrl, get }),
    getDexChains: getDexChains({ apiUrl, get }),
    getDexSwapQuote: getDexSwapQuote({ apiUrl, authorizedPost }),
    getDexTokenAllowance: getDexTokenAllowance({ apiUrl, post }),
    getDexUserEligibility: getDexUserEligibility({ authorizedGet, nabuUrl }),
    searchDexTokens: searchDexTokens({ apiUrl, get })
  }
}
