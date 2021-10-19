import { NftAssetsType, NftOrdersType } from './types'

const JAYZ_ADDRESS = '0x3b417faee9d2ff636701100891dc2755b5321cc3'

export default ({ get }) => {
  const fulfillNftOrder = () => {}

  const getNftAssets = (
    owner: string,
    offset = 0,
    limit = 10,
    order_direction: 'asc' | 'desc' = 'asc'
  ): NftAssetsType => {
    return get({
      endPoint: `?owner=${JAYZ_ADDRESS}&order_direction=${order_direction}&offset=${offset}&limit=${limit}`,
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/api/v1/assets'
    })
  }

  const getNftOrders = (
    limit = 10,
    offset = 0,
    order_by = 'created_date',
    order_direction: 'asc' | 'desc' = 'desc',
    bundled = false,
    side = 0, // 0 for buy, 1 for sell
    include_bundled = false
  ): NftOrdersType =>
    get({
      endPoint: `?limit=20&offset=0&side=1`,
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/wyvern/v1/orders'
    })

  return {
    getNftAssets,
    getNftOrders
  }
}
