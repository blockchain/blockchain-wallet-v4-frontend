/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { init } from 'ramda'

import { Remote } from '@core'
import {
  AssetEventsType,
  CollectionData,
  ExplorerGatewayNftCollectionType,
  GasCalculationOperations,
  GasDataI,
  NftAsset,
  NftAssetsType,
  NftOrdersType,
  OfferEventsType,
  Order,
  RawOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await } from '@core/types'

import { NftOrderStepEnum, NftsStateType } from './types'

const initialState: NftsStateType = {
  activeTab: 'explore',
  assets: {
    atBound: false,
    collection: 'all',
    isFailure: false,
    isLoading: false,
    list: [],
    page: 0
  },
  cancelListing: Remote.NotAsked,
  cancelOffer: Remote.NotAsked,
  collectionSearch: [],
  collections: Remote.NotAsked,
  marketplace: {
    atBound: false,
    isFailure: false,
    isLoading: true,
    list: [],
    page: 0,
    token_ids_queried: []
  },
  offersMade: {
    atBound: false,
    isFailure: false,
    isLoading: true,
    list: [],
    page: 0
  },
  orderFlow: {
    activeOffer: null,
    activeOrder: null,
    asset: Remote.NotAsked,
    fees: Remote.NotAsked,
    order: Remote.NotAsked,
    step: NftOrderStepEnum.SHOW_ASSET
  },
  sellOrder: Remote.NotAsked,
  transfer: Remote.NotAsked
}

const nftsSlice = createSlice({
  initialState,
  name: 'nfts',
  reducers: {
    cancelListing: (
      state,
      action: PayloadAction<{ gasData: GasDataI; sell_order: RawOrder }>
    ) => {},
    cancelListingFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.cancelListing = Remote.Success(action.payload.error)
    },
    cancelListingLoading: (state) => {
      state.cancelListing = Remote.Loading
    },
    cancelListingSuccess: (state) => {
      state.cancelListing = Remote.Success(true)
    },
    cancelOffer: (
      state,
      action: PayloadAction<{ gasData: GasDataI; order: RawOrder | null }>
    ) => {},
    cancelOfferFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.cancelOffer = Remote.Success(action.payload.error)
    },
    cancelOfferLoading: (state) => {
      state.cancelOffer = Remote.Loading
    },
    cancelOfferSuccess: (state) => {
      state.cancelOffer = Remote.Success(true)
    },
    clearAndRefetchAssets: (state) => {},
    clearAndRefetchOffersMade: (state) => {},
    clearAndRefetchOrders: (state) => {},
    createOffer: (
      state,
      action: PayloadAction<{
        amount?: string
        coin?: string
        order: NftOrdersType['orders'][0]
      }>
    ) => {},
    createOfferFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.order = Remote.Failure(action.payload)
    },
    createOfferLoading: (state) => {
      state.orderFlow.order = Remote.Loading
    },
    createOfferSuccess: (state, action: PayloadAction<Order>) => {
      state.orderFlow.order = Remote.Success(action.payload)
    },
    createOrder: (
      state,
      action: PayloadAction<{
        amount?: string
        coin?: string
        gasData: GasDataI
        order: NftOrdersType['orders'][0]
      }>
    ) => {},
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.order = Remote.Failure(action.payload)
    },
    createOrderLoading: (state) => {
      state.orderFlow.order = Remote.Loading
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.orderFlow.order = Remote.Success(action.payload)
    },
    createSellOrder: (
      state,
      action: PayloadAction<{
        asset: NftAssetsType[0]
        endPrice: number | null
        gasData: GasDataI
        startPrice: number
      }>
    ) => {},
    createSellOrderFailure: (state, action: PayloadAction<string>) => {
      state.sellOrder = Remote.Failure(action.payload)
    },
    createSellOrderLoading: (state) => {
      state.sellOrder = Remote.Loading
    },
    createSellOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.sellOrder = Remote.Success(action.payload)
    },
    createTransfer: (
      state,
      action: PayloadAction<{
        asset: NftAssetsType[0]
        gasData: GasDataI
        to: string
      }>
    ) => {},
    createTransferFailure: (state, action: PayloadAction<string>) => {
      state.transfer = Remote.Failure(action.payload)
    },
    createTransferLoading: (state) => {
      state.transfer = Remote.Loading
    },
    createTransferSuccess: (state, action: PayloadAction<boolean>) => {
      state.transfer = Remote.Success(action.payload)
    },
    fetchFees: (
      state,
      action: PayloadAction<
        | {
            offer?: string
            operation: GasCalculationOperations.Buy
            order: NftOrdersType['orders'][0]
            paymentTokenAddress?: string
          }
        | {
            asset: NftAsset
            endPrice?: number
            operation: GasCalculationOperations.Sell
            startPrice: number
          }
        | {
            asset: NftAsset
            operation: GasCalculationOperations.Transfer
            to: string
          }
        | {
            operation: GasCalculationOperations.Cancel
            order: RawOrder
          }
      >
    ) => {},
    fetchFeesFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.fees = Remote.Failure(action.payload)
    },
    fetchFeesLoading: (state) => {
      state.orderFlow.fees = Remote.Loading
    },
    fetchFeesSuccess: (
      state,
      action: PayloadAction<Await<ReturnType<typeof calculateGasFees>>>
    ) => {
      state.orderFlow.fees = Remote.Success(action.payload)
    },
    fetchNftAssets: () => {},
    fetchNftAssetsFailure: (state, action: PayloadAction<string>) => {
      state.assets.isFailure = true
    },
    fetchNftAssetsLoading: (state) => {
      state.assets.isLoading = true
    },
    fetchNftAssetsSuccess: (state, action: PayloadAction<NftAssetsType>) => {
      state.assets.isFailure = false
      state.assets.isLoading = false
      state.assets.list = [...state.assets.list, ...action.payload]
    },
    fetchNftCollections: (
      state,
      action: PayloadAction<{
        direction?: 'ASC' | 'DESC'
        sortBy?: keyof ExplorerGatewayNftCollectionType
      }>
    ) => {},
    fetchNftCollectionsFailure: (state, action: PayloadAction<string>) => {
      state.collections = Remote.Failure(action.payload)
    },
    fetchNftCollectionsLoading: (state) => {
      state.collections = Remote.Loading
    },
    fetchNftCollectionsSuccess: (
      state,
      action: PayloadAction<ExplorerGatewayNftCollectionType[]>
    ) => {
      state.collections = Remote.Success(action.payload)
    },
    fetchNftOffersMade: () => {},
    fetchNftOffersMadeFailure: (state, action: PayloadAction<string>) => {
      state.offersMade.isFailure = true
    },
    fetchNftOffersMadeLoading: (state) => {
      state.offersMade.isLoading = true
    },
    fetchNftOffersMadeSuccess: (state, action: PayloadAction<OfferEventsType['asset_events']>) => {
      state.offersMade.isFailure = false
      state.offersMade.isLoading = false
      state.offersMade.list = [...state.offersMade.list, ...action.payload]
    },
    fetchNftOrderAsset: () => {},
    fetchNftOrderAssetFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.asset = Remote.Failure(action.payload)
    },
    fetchNftOrderAssetLoading: (state) => {
      state.orderFlow.asset = Remote.Loading
    },
    fetchNftOrderAssetSuccess: (state, action: PayloadAction<NftAsset>) => {
      state.orderFlow.asset = Remote.Success(action.payload)
    },
    fetchNftOrders: () => {},
    fetchNftOrdersFailure: (state, action: PayloadAction<string>) => {
      state.marketplace.isLoading = false
      state.marketplace.isFailure = true
    },
    fetchNftOrdersLoading: (state) => {
      state.marketplace.isLoading = true
    },
    fetchNftOrdersSuccess: (state, action: PayloadAction<NftOrdersType['orders']>) => {
      state.marketplace.isFailure = false
      state.marketplace.isLoading = false
      state.marketplace.list = [...state.marketplace.list, ...action.payload]
    },
    nftOrderFlowClose: (state) => {
      state.orderFlow.activeOrder = null
      state.orderFlow.activeOffer = null
      state.orderFlow.step = NftOrderStepEnum.SHOW_ASSET
      state.orderFlow.asset = Remote.NotAsked
      state.orderFlow.fees = Remote.NotAsked
      state.orderFlow.order = Remote.NotAsked
      state.cancelListing = Remote.NotAsked
      state.sellOrder = Remote.NotAsked
    },
    nftOrderFlowOpen: (
      state,
      action: PayloadAction<
        | { asset: NftAsset; offer: OfferEventsType['asset_events'][0]; order?: never }
        | { asset: NftAsset; offer?: never; order?: never }
        | { asset?: never; offer?: never; order: NftOrdersType['orders'][0] }
      >
    ) => {
      if (action.payload.order) {
        state.orderFlow.activeOrder = action.payload.order
      }
      state.orderFlow.asset = Remote.Loading
      state.orderFlow.step = NftOrderStepEnum.SHOW_ASSET
    },
    resetNftAssets: (state) => {
      state.assets.atBound = false
      state.assets.page = 0
      state.assets.isLoading = false
      state.assets.list = []
    },
    resetNftOffersMade: (state) => {
      state.offersMade.atBound = false
      state.offersMade.page = 0
      state.offersMade.isFailure = false
      state.offersMade.isLoading = true
      state.offersMade.list = []
    },
    resetNftOrders: (state) => {
      state.marketplace.atBound = false
      state.marketplace.page = 0
      state.marketplace.token_ids_queried = []
      state.marketplace.isFailure = false
      state.marketplace.isLoading = true
      state.marketplace.list = []
    },
    resetOrderFlow: (state) => {
      state.orderFlow.asset = Remote.NotAsked
      state.orderFlow.step = NftOrderStepEnum.SHOW_ASSET
      state.orderFlow.activeOrder = null
    },
    searchNftAssetContract: (
      state,
      action: PayloadAction<{ asset_contract_address?: string; search?: string }>
    ) => {},
    setActiveOffer: (state, action: PayloadAction<{ offer: RawOrder }>) => {
      state.orderFlow.activeOffer = action.payload.offer
    },
    setActiveTab: (state, action: PayloadAction<'explore' | 'my-collection' | 'offers'>) => {
      state.activeTab = action.payload
    },
    setAssetBounds: (state, action: PayloadAction<{ atBound: boolean }>) => {
      state.assets.atBound = action.payload.atBound
    },
    setAssetData: (state, action: PayloadAction<{ collection?: string; page?: number }>) => {
      state.assets.collection = action.payload.collection || 'all'
      state.assets.page = action.payload.page || 0
    },
    setCollectionSearch: (state, action: PayloadAction<ExplorerGatewayNftCollectionType[]>) => {
      state.collectionSearch = action.payload
    },
    setMarketplaceBounds: (state, action: PayloadAction<{ atBound: boolean }>) => {
      state.marketplace.atBound = action.payload.atBound
    },
    setMarketplaceData: (
      state,
      action: PayloadAction<{
        atBound?: boolean
        collection?: CollectionData
        page?: number
        token_ids_queried?: string[]
      }>
    ) => {
      state.marketplace.page = action.payload.page || 0
      if (action.payload.atBound) state.marketplace.atBound = action.payload.atBound
      if (action.payload.collection) state.marketplace.collection = action.payload.collection
      if (action.payload.token_ids_queried)
        state.marketplace.token_ids_queried = action.payload.token_ids_queried
    },
    setOffersMadeBounds: (state, action: PayloadAction<{ atBound: boolean }>) => {
      state.offersMade.atBound = action.payload.atBound
    },
    setOffersMadeData: (state, action: PayloadAction<{ page?: number }>) => {
      state.assets.page = action.payload.page || 0
    },
    setOrderFlowStep: (state, action: PayloadAction<{ step: NftOrderStepEnum }>) => {
      state.orderFlow.step = action.payload.step
    }
  }
})

const { actions } = nftsSlice
const nftsReducer = nftsSlice.reducer
export { actions, nftsReducer }
