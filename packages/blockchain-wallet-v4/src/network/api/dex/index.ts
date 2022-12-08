import { getDexChainAllTokens, getDexChains, getDexSwapQuote } from './requests'

export type { DexChain, DexSwapQuote, DexToken } from './types'

export default ({ apiUrl, authorizedPost, get, post }) => {
  return {
    getDexChainAllTokens: getDexChainAllTokens({ apiUrl, post }),
    getDexChains: getDexChains({ apiUrl, get }),
    getDexSwapQuote: getDexSwapQuote({ apiUrl, authorizedPost })
  }
}
