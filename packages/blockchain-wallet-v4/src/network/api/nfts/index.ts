import { NftAssetsType } from './types'

export default ({ get }) => {
  const getNftAssets = (
    owner: string,
    offset = 0,
    limit = 20,
    order_direction: 'asc' | 'desc' = 'desc'
  ): NftAssetsType => {
    return get({
      endPoint: `?owner=${owner}&order_direction=${order_direction}&offset=${offset}&limit=${limit}`,
      ignoreQueryParams: true,
      url: 'https://api.opensea.io/api/v1/assets'
    })
  }

  return {
    getNftAssets
  }
}
