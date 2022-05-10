import { ExplorerGatewaySearchType, NftAsset, OpenSeaStatus } from './types'

export const NFT_ORDER_PAGE_LIMIT = 30

export default ({ apiUrl, get, openSeaApi, post }) => {
  // const explorerUrl = 'http://localhost:8081/nft' // local testnet only
  const explorerUrl = `${apiUrl}/nft-market-api/nft`
  const openSeaUrl = `${openSeaApi}/api/v1`

  const searchNfts = (query: string): ExplorerGatewaySearchType => {
    return post({
      contentType: 'application/json',
      data: {
        query
      },
      endPoint: `/search`,
      ignoreQueryParams: true,
      url: `${explorerUrl}`
    })
  }

  const getOpenSeaAsset = (collection_id: string, asset_number: string): NftAsset => {
    return get({
      endPoint: `/asset/${collection_id}/${asset_number}?include_orders=true`,
      ignoreQueryParams: true,
      url: openSeaUrl
    })
  }

  const getOpenSeaStatus = (): OpenSeaStatus => {
    return get({
      endPoint: `/status`,
      ignoreQueryParams: true,
      url: `${explorerUrl}`
    })
  }

  const postNftOrder = (order) => {
    return post({
      contentType: 'application/json',
      data: order,
      endPoint: `/order`,
      ignoreQueryParams: true,
      removeDefaultPostData: true,
      url: `${explorerUrl}`
    })
  }

  return {
    getOpenSeaAsset,
    getOpenSeaStatus,
    postNftOrder,
    searchNfts
  }
}
