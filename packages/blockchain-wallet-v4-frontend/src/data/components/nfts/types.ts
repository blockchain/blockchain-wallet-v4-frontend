import {
  CollectionData,
  ExplorerGatewayNftCollectionType,
  NftAsset,
  NftAssetsType,
  NftOrder,
  NftOrdersType,
  OfferEventsType,
  RawOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await, RemoteDataType } from '@core/types'

export enum NftOrderStepEnum {
  ACCEPT_OFFER = 'ACCEPT_OFFER',
  CANCEL_LISTING = 'CANCEL_LISTING',
  CANCEL_OFFER = 'CANCEL_OFFER',
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
    list: NftAssetsType
    page: number
  }
  collectionSearch: ExplorerGatewayNftCollectionType[]
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
  openSeaStatus: RemoteDataType<
    string,
    {
      page: {
        id: string
        name: string
        time_zone: string
        updated_at: string
        url: string
      }
      status: {
        description: string
        indicator: string
      }
    }
  >
  orderFlow: {
    activeOrder: NftOrder | null
    asset: RemoteDataType<string, NftAsset>
    fees: RemoteDataType<string, Await<ReturnType<typeof calculateGasFees>>>
    isSubmitting: boolean
    listingToCancel: RawOrder | null
    matchingOrder: RemoteDataType<string, { buy: NftOrder; sell: NftOrder }>
    offerToCancel: RawOrder | null
    step: NftOrderStepEnum
  }
}
