import { CollectionData, NftAssetsType, NftOrdersType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'

export type NftsStateType = {
  assets: RemoteDataType<string, NftAssetsType['assets']>
  marketplace: {
    atBound?: boolean
    collection?: CollectionData
    page: number
    token_ids_queried: string[]
  }
  orders: RemoteDataType<string, NftOrdersType['orders']>[]
}
