import {
  ExplorerGatewayNftCollectionType,
  NftAsset,
  NftAssetsType,
  NftCollection,
  NftOrder,
  OfferEventsType,
  RawOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await, RemoteDataType } from '@core/types'

export enum NftOrderStepEnum {
  ACCEPT_OFFER = 'ACCEPT_OFFER',
  BUY = 'BUY',
  CANCEL_LISTING = 'CANCEL_LISTING',
  CANCEL_OFFER = 'CANCEL_OFFER',
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
  collection: RemoteDataType<string, NftCollection>
  collectionFilter: {
    isBuyNow: boolean
    traits: {
      [key in string]: {
        [key in string]: boolean
      }
    }
  }
  collectionSearch: ExplorerGatewayNftCollectionType[]
  collections: RemoteDataType<string, ExplorerGatewayNftCollectionType[]>
  offersMade: {
    atBound?: boolean
    isFailure: boolean
    isLoading: boolean
    list: OfferEventsType['asset_events']
    page: number
  }
  openSeaAsset: RemoteDataType<string, NftAsset>
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
    asset: RemoteDataType<string, NftAsset>
    fees: RemoteDataType<string, Await<ReturnType<typeof calculateGasFees>>>
    isSubmitting: boolean
    listingToCancel: RawOrder | null
    matchingOrder: RemoteDataType<string, { buy: NftOrder; sell: NftOrder }>
    offerToCancel: RawOrder | null
    orderToMatch: RawOrder | null
    step: NftOrderStepEnum
    walletUserIsAssetOwnerHack: boolean
  }
}
