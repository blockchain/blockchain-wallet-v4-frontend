import {
  AssetEventsType,
  ExplorerGatewayNftCollectionType,
  NftAsset,
  NftAssetsType,
  NftCollection,
  NftOrdersType,
  OfferEventsType,
  OpenSeaStatus
} from './types'

// const JAYZ_ADDRESS = '0x3b417faee9d2ff636701100891dc2755b5321cc3'
export const NFT_ORDER_PAGE_LIMIT = 30

export default ({ apiUrl, get, openseaApi, post }) => {
  // const explorerUrl = 'http://localhost:8081/nft' // local testnet only
  const explorerUrl = `${apiUrl}/explorer-gateway/nft`
  const openseaUrl = `${openseaApi}/api/v1`

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

  const getNftRecentEvents = (slug: string, page = 0): AssetEventsType => {
    return get({
      endPoint: `/events?event_type=created&collection_slug=${slug}&limit=${NFT_ORDER_PAGE_LIMIT}&offset=${
        NFT_ORDER_PAGE_LIMIT * page
      }`,
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

  // TODO
  // const getOffersReceived = () => {}

  const searchNftCollectionInfo = (slug: string): ExplorerGatewayNftCollectionType[] => {
    return get({
      endPoint: `/collection/search?query=${slug}`,
      ignoreQueryParams: true,
      url: `${explorerUrl}`
    })
  }

  const getNftOrders = (
    limit = NFT_ORDER_PAGE_LIMIT,
    asset_contract_address: string,
    token_ids: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payment_token_address = '0x0000000000000000000000000000000000000000', // eth
    side = 1, // 0 for buy, 1 for sell
    taker?: string
  ): NftOrdersType => {
    return get({
      endPoint: `/orders?asset_contract_address=${asset_contract_address}&payment_token_address=${payment_token_address}&sale_kind=0&bundled=false&include_bundled=false&include_invalid=false&is_english=false&side=${side}&limit=${limit}&token_ids=${token_ids}${
        taker ? `&taker=${taker}` : ''
      }`,
      ignoreQueryParams: true,
      url: `${explorerUrl}`
    })
  }

  const getOpenSeaAsset = (collection_id: string, asset_number: string): NftAsset => {
    return get({
      endPoint: `/asset/${collection_id}/${asset_number}`,
      ignoreQueryParams: true,
      url: openseaUrl
    })
  }

  const getOpenseaStatus = (): OpenSeaStatus => {
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
    getNftOrders,
    getNftRecentEvents,
    getOffersMade,
    getOpenSeaAsset,
    getOpenseaStatus,
    postNftOrder,
    searchNftCollectionInfo
  }
}
