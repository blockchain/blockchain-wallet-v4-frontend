import {
  ExplorerGatewayNftCollectionType,
  ExplorerGatewaySearchType,
  NftAsset,
  NftAssetsType,
  NftCollection,
  NftOrder,
  NftUserPreferencesReturnType,
  RawOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await, RemoteDataType } from '@core/types'

export enum NftOrderStatusEnum {
  POST_BUY_ORDER = 'POST_BUY_ORDER',
  POST_BUY_ORDER_SUCCESS = 'POST_BUY_ORDER_SUCCESS',
  POST_LISTING = 'POST_LISTING',
  POST_LISTING_SUCCESS = 'POST_LISTING_SUCCESS',
  POST_OFFER = 'POST_OFFER',
  POST_OFFER_SUCCESS = 'POST_OFFER_SUCCESS',
  WRAP_ETH = 'WRAP_ETH'
}

export enum NftOrderStepEnum {
  ACCEPT_OFFER = 'ACCEPT_OFFER',
  BUY = 'BUY',
  CANCEL_LISTING = 'CANCEL_LISTING',
  CANCEL_OFFER = 'CANCEL_OFFER',
  MAKE_OFFER = 'MAKE_OFFER',
  MARK_FOR_SALE = 'MARK_FOR_SALE',
  NOT_VERIFIED = 'NOT_VERIFIED',
  STATUS = 'STATUS',
  TRANSFER = 'TRANSFER',
  WRAP_ETH = 'WRAP_ETH'
}

export type NftsStateType = {
  activeSlug?: string
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
  collections: RemoteDataType<string, ExplorerGatewayNftCollectionType[]>
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
    fees: RemoteDataType<string, Await<ReturnType<typeof calculateGasFees>>>
    isSubmitting: boolean
    listingToCancel: RawOrder | null
    matchingOrder: RemoteDataType<string, { buy: NftOrder; sell: NftOrder }>
    offerToCancel: RawOrder | null
    orderToMatch: RawOrder | null
    prevStep: NftOrderStepEnum | null
    status: NftOrderStatusEnum | null
    step: NftOrderStepEnum | null
    userHasPendingTxR: RemoteDataType<string, boolean>
    wrapEthFees: RemoteDataType<string, Await<ReturnType<typeof calculateGasFees>>>
  }
  search: RemoteDataType<string, ExplorerGatewaySearchType>
  userPreferences: RemoteDataType<string, NftUserPreferencesReturnType>
}
