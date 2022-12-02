import { DexSwapQuoteRequest, DexSwapQuoteResponse } from './types'

const DEX_GATEWAY_PREFIX = '/dex-gateway/v1'

export default ({ apiUrl, get, post }) => {
  const getDexChains = () =>
    get({
      contentType: 'application/json',
      endPoint: `/${DEX_GATEWAY_PREFIX}/chains`,
      url: apiUrl
    })

  const getDexChainAllTokens = (chainId: number) =>
    post({
      contentType: 'application/json',
      data: {
        chainId,
        queryBy: 'TOP' // FIXME: Change to ALL after checking how we have ETH added there
      },
      endPoint: `/${DEX_GATEWAY_PREFIX}/tokens`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getDexSwapQuote = (quoteRequest: DexSwapQuoteRequest): DexSwapQuoteResponse =>
    post({
      contentType: 'application/json',
      data: quoteRequest,
      endPoint: '/dex-gateway/v1/quote',
      removeDefaultPostData: true,
      url: apiUrl
    })

  return {
    getDexChainAllTokens,
    getDexChains,
    getDexSwapQuote
  }
}
