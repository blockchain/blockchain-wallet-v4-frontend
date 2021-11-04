import { AssetEventsType, NftAssetsType, NftOrdersType } from './types'

// const JAYZ_ADDRESS = '0x3b417faee9d2ff636701100891dc2755b5321cc3'
export const NFT_ORDER_PAGE_LIMIT = 30

export default ({ get, post }) => {
  const postNftOrder = (order) => {
    return post({
      contentType: 'application/json',
      data: { order },
      endPoint: `/wyvern/v1/orders/post`,
      ignoreQueryParams: true,
      removeDefaultPostData: true,
      url: 'https://api.opensea.io'
    })
  }

  const getNftAssets = (
    owner: string,
    offset = 0,
    limit = 10,
    order_direction: 'asc' | 'desc' = 'asc'
  ): NftAssetsType => {
    return get({
      endPoint: `?owner=${owner}&order_direction=${order_direction}&offset=${offset}&limit=${limit}`,
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/api/v1/assets'
    })
  }

  const getNftCollectionInfo = (slug: string) => {
    return get({
      endPoint: `/nft/collection/${slug}`,
      ignoreQueryParams: true,
      url: 'http://explorer-gateway.traefik'
    })
  }

  const getNftRecentEvents = (slug: string, page = 0): AssetEventsType => {
    return get({
      endPoint: `/events?collection_slug=${slug}&event_type=created&format=json&limit=${NFT_ORDER_PAGE_LIMIT}&offset=${
        NFT_ORDER_PAGE_LIMIT * page
      }`,
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/api/v1'
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
      endPoint: `?asset_contract_address=${asset_contract_address}&payment_token_address=${payment_token_address}&sale_kind=0&bundled=false&include_bundled=false&include_invalid=false&side=${side}&limit=${limit}${token_ids}`,
      headers: {
        'X-API-KEY': 'd0b6281e87d84702b020419fdf58ea81'
      },
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/wyvern/v1/orders'
    })
  }

  return {
    getNftAssets,
    getNftCollectionInfo,
    getNftOrders,
    getNftRecentEvents,
    postNftOrder
  }
}
