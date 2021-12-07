import {
  AssetEventsType,
  CollectionData,
  ExplorerGatewayNftCollectionType,
  NftAsset,
  NftAssetsType,
  NftOrdersType,
  OfferEventsType,
  Order
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await, RemoteDataType } from '@core/types'

export enum NftOrderStepEnum {
  CONFIRM_BUY = 'CONFIRM_BUY',
  MAKE_OFFER = 'MAKE_OFFER',
  MARK_FOR_SALE = 'MARK_FOR_SALE',
  SHOW_ASSET = 'SHOW_ASSET',
  TRANSFER = 'TRANSFER'
}

export type NftsStateType = {
  activeTab: 'explore' | 'my-collection' | 'offers'
  assets: {
    atBound: boolean
    collection: string
    isFailure: boolean
    isLoading: boolean
    list: NftAssetsType['assets']
    page: number
  }
  cancelListing: RemoteDataType<string, boolean>
  collections: RemoteDataType<string, ExplorerGatewayNftCollectionType[]>
  marketplace: {
    atBound?: boolean
    collection?: CollectionData
    isFailure: boolean
    isLoading: boolean
    list: NftOrdersType['orders']
    page: number
    token_ids_queried: string[]
  }
  offersMade: {
    atBound?: boolean
    isFailure: boolean
    isLoading: boolean
    list: OfferEventsType['asset_events']
    page: number
  }
  orderFlow: {
    activeOrder: NftOrdersType['orders'][0] | null
    asset: RemoteDataType<string, NftAsset>
    fees: RemoteDataType<string, Await<ReturnType<typeof calculateGasFees>>>
    order: RemoteDataType<string, Order>
    step: NftOrderStepEnum
  }
  sellOrder: RemoteDataType<string, boolean>
  transfer: RemoteDataType<string, boolean>
}
