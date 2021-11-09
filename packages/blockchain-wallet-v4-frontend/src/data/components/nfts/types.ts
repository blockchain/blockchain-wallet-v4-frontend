import {
  CollectionData,
  NftAsset,
  NftAssetsType,
  NftOrdersType
} from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'

export enum NftOrderStepEnum {
  CONFIRM_BUY = 'CONFIRM_BUY',
  SHOW_ASSET = 'SHOW_ASSET'
}

export type NftsStateType = {
  assets: RemoteDataType<string, NftAssetsType['assets']>
  marketplace: {
    atBound?: boolean
    collection?: CollectionData
    page: number
    token_ids_queried: string[]
  }
  orderFlow: {
    activeOrder: NftOrdersType['orders'][0] | null
    asset: RemoteDataType<string, NftAsset>
    step: NftOrderStepEnum
  }
  orders: {
    isFailure: boolean
    isLoading: boolean
    list: NftOrdersType['orders']
  }
}
