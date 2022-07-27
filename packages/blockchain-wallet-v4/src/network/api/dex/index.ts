import { DexSwapQuoteRequest, DexSwapQuoteResponse } from './types'

export default ({ apiUrl, get, post }) => {
  const getDexChains = () =>
    get({
      endPoint: `/dex-gateway/v1/chains`,
      url: apiUrl
    })

  const getDexChainTopTokens = (chainId: number) =>
    post({
      contentType: 'application/json',
      data: {
        chainId,
        queryBy: 'TOP'
      },
      endPoint: '/dex-gateway/v1/tokens',
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
    getDexChainTopTokens,
    getDexChains,
    getDexSwapQuote
  }
}
