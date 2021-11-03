import { NftAssetsType, NftOrdersType } from './types'

// const JAYZ_ADDRESS = '0x3b417faee9d2ff636701100891dc2755b5321cc3'

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

  const getNftOrders = (
    limit = 50,
    offset = 0,
    asset_contract_address: string,
    order_direction: 'asc' | 'desc' = 'desc',
    payment_token_address = '0x0000000000000000000000000000000000000000',
    side = 1 // 0 for buy, 1 for sell
  ): NftOrdersType => {
    const token_ids = Array.from(Array(30).keys())
      .map((i) => `&token_ids=${i}`)
      .join('')

    return get({
      endPoint: `?asset_contract_address=${asset_contract_address}&payment_token_address=${payment_token_address}&sale_kind=0&bundled=false&include_bundled=false&include_invalid=false&side=${side}&limit=${limit}&offset=${offset}&order_by=eth_price&order_direction=${order_direction}${token_ids}`,
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/wyvern/v1/orders'
    })
  }

  return {
    getNftAssets,
    getNftOrders,
    postNftOrder
  }
}
