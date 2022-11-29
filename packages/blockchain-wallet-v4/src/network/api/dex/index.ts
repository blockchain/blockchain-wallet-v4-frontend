import { DexSwapQuoteQueryParams, DexSwapQuoteRequest, DexSwapQuoteResponse } from './types'

const DEX_NABU_GATEWAY_PREFIX = '/nabu-gateway/dex'

export default ({ apiUrl, authorizedPost, get, post }) => {
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

  const getDexSwapQuote = (
    quoteRequest: DexSwapQuoteRequest,
    queryParams: DexSwapQuoteQueryParams
  ): DexSwapQuoteResponse =>
    authorizedPost({
      contentType: 'application/json',
      data: quoteRequest,
      endPoint: `${DEX_NABU_GATEWAY_PREFIX}/quote`,
      params: queryParams,
      removeDefaultPostData: true,
      url: apiUrl
    })

  return {
    getDexChainTopTokens,
    getDexChains,
    getDexSwapQuote
  }
}
