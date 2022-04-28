import {
  ExplorerGatewayNftCollectionType,
  ExplorerGatewaySearchType,
  NftAsset,
  OfferEventsType,
  OpenSeaOrder,
  OpenSeaStatus
} from './types'

// const JAYZ_ADDRESS = '0x3b417faee9d2ff636701100891dc2755b5321cc3'
export const NFT_ORDER_PAGE_LIMIT = 30

export default ({ apiUrl, get, openSeaApi, post }) => {
  // const explorerUrl = 'http://localhost:8081/nft' // local testnet only
  const explorerUrl = `${apiUrl}/explorer-gateway/nft`
  const openSeaUrl = `${openSeaApi}/api/v1`

  const getAssetContract = (asset_contract_address: string) => {
    return get({
      endPoint: `/asset-contract/${asset_contract_address}`,
      ignoreQueryParams: true,
      url: `${explorerUrl}`
    })
  }

  const getOffersMade = (
    account_address: string,
    offset = 0,
    limit = NFT_ORDER_PAGE_LIMIT
  ): OfferEventsType => {
    return get({
      endPoint: `/events?event_type=offer_entered&limit=${limit}&offset=${
        NFT_ORDER_PAGE_LIMIT * offset
      }&account_address=${account_address}`,
      ignoreQueryParams: true,
      url: `${explorerUrl}`
    })
  }

  const getNftCollections = (
    sortedBy = 'one_day_vol',
    direction = 'DESC'
  ): ExplorerGatewayNftCollectionType[] => {
    return get({
      endPoint: `/collections?sortedBy=${sortedBy}&direction=${direction}`,
      ignoreQueryParams: true,
      url: `${explorerUrl}`
    })
  }

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
      endPoint: `/asset/${collection_id}/${asset_number}`,
      ignoreQueryParams: true,
      url: openSeaUrl
    })
  }

  const getOpenSeaOrders = (
    asset_contract_address: string,
    token_id: string
  ): { orders: OpenSeaOrder[] } => {
    return get({
      endPoint: `/orders?asset_contract_address=${asset_contract_address}&token_ids=${token_id}`,
      ignoreQueryParams: true,
      url: `${explorerUrl}`
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
    getAssetContract,
    getNftCollections,
    getOffersMade,
    getOpenSeaAsset,
    getOpenSeaOrders,
    getOpenSeaStatus,
    postNftOrder,
    searchNfts
  }
}
