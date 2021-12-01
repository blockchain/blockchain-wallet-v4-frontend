import {
  AssetEventsType,
  ExplorerGatewayNftCollectionType,
  NftAssetsType,
  NftOrdersType,
  OfferEventsType
} from './types'

// const JAYZ_ADDRESS = '0x3b417faee9d2ff636701100891dc2755b5321cc3'
export const NFT_ORDER_PAGE_LIMIT = 10

export default ({ apiUrl, get, openseaApi, post }) => {
  const openseaUrl = `${openseaApi}/api/v1`
  const openseaMarketplaceApi = `${openseaApi}/wyvern/v1`

  const headers = {
    'X-API-KEY': openseaApi.includes('rinkeby')
      ? 'b6f0671559ae4285bcecc7b9702f224a'
      : 'd0b6281e87d84702b020419fdf58ea81'
  }

  const getAssetContract = (asset_contract_address: string) => {
    return get({
      endPoint: `/${asset_contract_address}`,
      headers,
      ignoreQueryParams: true,
      url: `${openseaUrl}/asset_contract`
    })
  }

  const getNftAsset = (contract_address: string, token_id: string): NftAssetsType => {
    return get({
      endPoint: `/${contract_address}/${token_id}`,
      ignoreQueryParams: true,
      url: `${openseaUrl}/asset`
    })
  }

  const getNftAssets = (
    owner: string /* = JAYZ_ADDRESS */,
    offset = 0,
    limit = NFT_ORDER_PAGE_LIMIT,
    order_direction: 'asc' | 'desc' = 'asc'
  ): NftAssetsType => {
    return get({
      endPoint: `?owner=${owner}&order_direction=${order_direction}&offset=${
        offset * NFT_ORDER_PAGE_LIMIT
      }&limit=${limit}`,
      ignoreQueryParams: true,
      url: `${openseaUrl}/assets`
    })
  }

  const getOffersMade = (
    account_address: string,
    offset = 0,
    limit = NFT_ORDER_PAGE_LIMIT
  ): OfferEventsType => {
    return get({
      endPoint: `?only_opensea=true&offset=${
        offset * NFT_ORDER_PAGE_LIMIT
      }&limit=${limit}&event_type=offer_entered&account_address=${account_address}`,
      headers,
      ignoreQueryParams: true,
      url: `${openseaUrl}/events`
    })
  }

  const getNftCollections = (
    sortedBy = '7_day_vol',
    direction = 'DESC',
    offset?: number,
    limit?: number
  ): ExplorerGatewayNftCollectionType[] => {
    return get({
      endPoint: `/nft/collections?sortedBy=${sortedBy}&direction=${direction}`,
      ignoreQueryParams: true,
      url: `${apiUrl}/explorer-gateway`
    })
  }

  // TODO
  // const getOffersReceived = () => {}

  const getNftCollectionInfo = (slug: string) => {
    return get({
      endPoint: `/nft/collection/${slug}/`,
      ignoreQueryParams: true,
      url: `http://localhost:8081`
    })
  }

  const getNftRecentEvents = (slug: string, page = 0): AssetEventsType => {
    return get({
      endPoint: `/events?collection_slug=${slug}&event_type=created&format=json&limit=${NFT_ORDER_PAGE_LIMIT}&offset=${
        NFT_ORDER_PAGE_LIMIT * page
      }`,
      headers,
      ignoreQueryParams: true,
      url: openseaUrl
    })
  }

  const getNftOrders = (
    limit = NFT_ORDER_PAGE_LIMIT,
    asset_contract_address: string,
    token_ids: string,
    payment_token_address = '0x0000000000000000000000000000000000000000', // eth
    side = 1 // 0 for buy, 1 for sell,
  ): NftOrdersType => {
    return get({
      endPoint: `?asset_contract_address=${asset_contract_address}&sale_kind=0&bundled=false&include_bundled=false&include_invalid=false&is_english=false&side=${side}&limit=${limit}${token_ids}`,
      headers,
      ignoreQueryParams: true,
      url: `${openseaMarketplaceApi}/orders`
    })
  }

  const postNftOrder = (order) => {
    return post({
      contentType: 'application/json',
      data: order,
      endPoint: `/orders/post/`,
      headers,
      ignoreQueryParams: true,
      removeDefaultPostData: true,
      url: `${openseaMarketplaceApi}`
    })
  }

  return {
    getAssetContract,
    getNftAsset,
    getNftAssets,
    getNftCollectionInfo,
    getNftCollections,
    getNftOrders,
    getNftRecentEvents,
    getOffersMade,
    postNftOrder
  }
}
