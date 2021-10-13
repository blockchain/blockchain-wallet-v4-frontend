import { NftAssetsType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'

export type NftsStateType = {
  assets: RemoteDataType<string, NftAssetsType['assets']>
}
