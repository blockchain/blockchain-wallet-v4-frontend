import {
  CollectionData,
  ExplorerGatewayNftCollectionType,
  NftAsset,
  NftAssetsType,
  NftOrdersType,
  OfferEventsType,
  Order,
  RawOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await, RemoteDataType } from '@core/types'

export enum NftOrderStepEnum {
  ACCEPT_OFFER = 'ACCEPT_OFFER',
  CANCEL_OFFER = 'CANCEL_OFFER',
  CONFIRM_BUY = 'CONFIRM_BUY',
  MAKE_OFFER = 'MAKE_OFFER',
  MARK_FOR_SALE = 'MARK_FOR_SALE',
  SHOW_ASSET = 'SHOW_ASSET',
  TRANSFER = 'TRANSFER'
}

export type NftsStateType = {
  acceptOffer: RemoteDataType<string, boolean>
  activeTab: 'explore' | 'my-collection' | 'offers'
  assets: {
    atBound: boolean
    collection: string
    isFailure: boolean
    isLoading: boolean
    list: NftAssetsType
    page: number
  }
  cancelListing: RemoteDataType<string, boolean>
  cancelOffer: RemoteDataType<string, boolean>
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
  offersForAsset: {
    atBound?: boolean
    isFailure: boolean
    isLoading: boolean
    list: Order[]
    page: number
  }
  offersMade: {
    atBound?: boolean
    isFailure: boolean
    isLoading: boolean
    list: OfferEventsType['asset_events']
    page: number
  }
  orderFlow: {
    activeOffer: RawOrder | null
    activeOrder: NftOrdersType['orders'][0] | null
    asset: RemoteDataType<string, NftAsset>
    fees: RemoteDataType<string, Await<ReturnType<typeof calculateGasFees>>>
    offerToAccept: RemoteDataType<string, { buy: Order; sell: Order }>
    order: RemoteDataType<string, Order>
    step: NftOrderStepEnum
  }
  sellOrder: RemoteDataType<string, boolean>
  transfer: RemoteDataType<string, boolean>
}
