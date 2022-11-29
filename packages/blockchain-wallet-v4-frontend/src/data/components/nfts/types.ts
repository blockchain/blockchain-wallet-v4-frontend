import {
  ExplorerGatewayNftCollectionType,
  ExplorerGatewaySearchType,
  NftAsset,
  NftAssetsType,
  NftCollection,
  NftOrder,
  NftUserPreferencesReturnType,
  OpenSeaStatus,
  OwnerNftBalance,
  SeaportRawOrder,
  WyvernRawOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await, RemoteDataType } from '@core/types'

export enum NftOrderStatusEnum {
  APPROVE_ERC20 = 'APPROVE_ERC20',
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
  IMPORT_NFTS = 'IMPORT_NFTS',
  MAKE_OFFER = 'MAKE_OFFER',
  MARK_FOR_SALE = 'MARK_FOR_SALE',
  NOT_VERIFIED = 'NOT_VERIFIED',
  PURCHASE_NFTS = 'PURCHASE_NFTS',
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
  nftOwnerAssets: RemoteDataType<OwnerNftBalance, OwnerNftBalance>
  openSeaAsset: RemoteDataType<string, NftAsset>
  openSeaStatus: RemoteDataType<
    OpenSeaStatus,
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
    matchingOrder_LEGACY: RemoteDataType<string, { buy: NftOrder; sell: NftOrder }>
    prevStep: NftOrderStepEnum | null
    seaportOrder: SeaportRawOrder | null
    status: NftOrderStatusEnum | null
    step: NftOrderStepEnum | null
    userHasPendingTxR: RemoteDataType<string, boolean>
    viewOrder: NftAsset | null
    wrapEthFees: RemoteDataType<string, Await<ReturnType<typeof calculateGasFees>>>
    wyvernOrder: WyvernRawOrder | null
  }
  search: RemoteDataType<string, ExplorerGatewaySearchType>
  userPreferences: RemoteDataType<string, NftUserPreferencesReturnType>
}
