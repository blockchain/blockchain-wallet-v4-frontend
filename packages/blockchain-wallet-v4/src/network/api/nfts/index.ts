import { NftAssetsType, NftOrdersType } from './types'

export default ({ get }) => {
  const getNftAssets = (
    owner: string,
    offset = 0,
    limit = 20,
    order_direction: 'asc' | 'desc' = 'desc'
  ): NftAssetsType => {
    return get({
      endPoint: `?owner=${'0xf32aab5cE63eF6ABC39f2F6A0586999716d889Dc'}&order_direction=${order_direction}&offset=${offset}&limit=${limit}`,
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/api/v1/assets'
    })
  }

  const getNftOrders = (
    limit = 20,
    offset = 0,
    order_by = 'created_date',
    order_direction: 'asc' | 'desc' = 'desc',
    bundled = false,
    include_bundled = false
  ): NftOrdersType =>
    get({
      endPoint: `?bundled=${bundled}&include_bundled=${include_bundled}&include_invalid=false&limit=${limit}&offset=${offset}&order_by=${order_by}&order_direction=${order_direction}`,
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/wyvern/v1/orders'
    })

  return {
    getNftAssets,
    getNftOrders
  }
}
