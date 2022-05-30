import {
  ExplorerGatewaySearchType,
  NftAsset,
  NftOrder,
  NftUserPreferencesReturnType,
  NftUserPreferencesType,
  OpenSeaStatus
} from './types'

export const NFT_ORDER_PAGE_LIMIT = 30

export default ({ apiUrl, get, openSeaApi, post }) => {
  // const nftUrl = 'http://localhost:8081/public/nft' // local testnet only
  const nftUrl = `${apiUrl}/nft-market-api/nft`
  const openSeaUrl = `${openSeaApi}/api/v1`

  const getNftUserPreferences = (jwt: string) => {
    return get({
      endPoint: '/preferences',
      headers: {
        jwt
      },
      ignoreQueryParams: true,
      url: nftUrl
    })
  }

  const setNftUserPreferences = (
    jwt: string,
    userPrefs: NftUserPreferencesType
  ): NftUserPreferencesReturnType => {
    return post({
      contentType: 'application/json',
      data: {
        jwt,
        userPrefs
      },
      endPoint: '/preferences',
      ignoreQueryParams: true,
      removeDefaultPostData: true,
      url: nftUrl
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
      url: nftUrl
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
      url: nftUrl
    })
  }

  const postNftOrder = (
    order: NftOrder,
    asset_collection_slug: string,
    guid: string,
    jwt: string
  ) => {
    return post({
      contentType: 'application/json',
      data: { asset_collection_slug, guid, jwt, orderJson: order },
      endPoint: `/order`,
      ignoreQueryParams: true,
      removeDefaultPostData: true,
      url: nftUrl
    })
  }

  return {
    getNftUserPreferences,
    getOpenSeaAsset,
    getOpenSeaStatus,
    postNftOrder,
    searchNfts,
    setNftUserPreferences
  }
}
