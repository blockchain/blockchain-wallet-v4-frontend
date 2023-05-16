import {
  getDexChains,
  getDexChainTokens,
  getDexSwapQuote,
  getDexTokenAllowance,
  getDexUserEligibility,
  searchDexTokens
} from './requests'

export type { DexChain, DexSwapQuote, DexToken, DexTokenWithBalance } from './types'

export default ({ apiUrl, authorizedGet, authorizedPost, get }) => {
  return {
    getDexChainTokens: getDexChainTokens({ apiUrl, get }), // can't get this to work
    getDexChains: getDexChains({ apiUrl, get }),
    getDexSwapQuote: getDexSwapQuote({ apiUrl, authorizedPost }),
    getDexTokenAllowance: getDexTokenAllowance({ apiUrl, authorizedPost }),
    getDexUserEligibility: getDexUserEligibility({ apiUrl, authorizedGet }),
    searchDexTokens: searchDexTokens({ apiUrl, get })
  }
}
