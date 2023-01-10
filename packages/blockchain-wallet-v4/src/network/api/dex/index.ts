import { getDexChains, getDexChainTokens, getDexSwapQuote, getDexUserEligibility } from './requests'

export type { DexChain, DexSwapQuote, DexToken, DexTokenWithBalance } from './types'

export default ({ apiUrl, authorizedGet, authorizedPost, get, post }) => {
  return {
    getDexChainTokens: getDexChainTokens({ apiUrl, post }),
    getDexChains: getDexChains({ apiUrl, get }),
    getDexSwapQuote: getDexSwapQuote({ apiUrl, authorizedPost }),
    getDexUserEligibility: getDexUserEligibility({ apiUrl, authorizedGet })
  }
}
