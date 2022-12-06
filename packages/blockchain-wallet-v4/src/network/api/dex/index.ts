import { DexSwapQuoteQueryParams, DexSwapQuoteRequest, DexSwapQuoteResponse } from './types'

const DEX_NABU_GATEWAY_PREFIX = '/nabu-gateway/dex'
const DEX_GATEWAY_PREFIX = '/dex-gateway/v1'

export default ({ apiUrl, authorizedPost, get, post }) => {
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
    getDexChainAllTokens,
    getDexChains,
    getDexSwapQuote
  }
}
