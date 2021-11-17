/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import {
  CollectionData,
  ExplorerGatewayNftCollectionType,
  GasCalculationOperations,
  GasDataI,
  NftAsset,
  NftAssetsType,
  NftOrdersType,
  Order,
  SellOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees, getNftBuyOrders } from '@core/redux/payment/nfts'
import { Await } from '@core/types'

import { NftOrderStepEnum, NftsStateType } from './types'

const initialState: NftsStateType = {
  assets: {
    atBound: false,
    collection: 'all',
    isFailure: false,
    isLoading: true,
    list: [],
    page: 0
  },
  cancelListing: Remote.NotAsked,
  collections: Remote.NotAsked,
  marketplace: {
    atBound: false,
    isFailure: false,
    isLoading: true,
    list: [],
    page: 0,
    token_ids_queried: []
  },
  orderFlow: {
    activeOrder: null,
    asset: Remote.NotAsked,
    fees: Remote.NotAsked,
    order: Remote.NotAsked,
    step: NftOrderStepEnum.SHOW_ASSET
  }
}

const nftsSlice = createSlice({
  initialState,
  name: 'nfts',
  reducers: {
    cancelListing: (
      state,
      action: PayloadAction<{ gasData: GasDataI; sell_order: SellOrder }>
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
    createSellOrder: (state, action: PayloadAction<{ asset: NftAssetsType['assets'][0] }>) => {},
    fetchFees: (
      state,
      action: PayloadAction<{
        amount?: string
        coin?: string
        operation: GasCalculationOperations
        order: NftOrdersType['orders'][0]
      }>
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
    fetchNftAssetsSuccess: (state, action: PayloadAction<NftAssetsType['assets']>) => {
      state.assets.isFailure = false
      state.assets.isLoading = false
      state.assets.list = [...state.assets.list, ...action.payload]
    },
    fetchNftCollections: () => {},
    fetchNftCollectionsFailure: (state, action: PayloadAction<string>) => {
      state.collections = Remote.Failure(action.payload)
    },
    fetchNftCollectionsLoading: (state) => {
      state.collections = Remote.Loading
    },
    fetchNftCollectionsSuccess: (
      state,
      action: PayloadAction<ExplorerGatewayNftCollectionType>
    ) => {
      state.collections = Remote.Success(action.payload)
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
      state.orderFlow.asset = Remote.NotAsked
      state.orderFlow.step = NftOrderStepEnum.SHOW_ASSET
    },
    nftOrderFlowOpen: (
      state,
      action: PayloadAction<
        { asset: NftAsset; order?: never } | { asset?: never; order: NftOrdersType['orders'][0] }
      >
    ) => {
      if (action.payload.order) {
        state.orderFlow.activeOrder = action.payload.order
      }
      state.orderFlow.asset = Remote.Loading
      state.orderFlow.step = NftOrderStepEnum.SHOW_ASSET
    },
    resetNftOrders: (state) => {
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
      action: PayloadAction<{ asset_contract_address: string }>
    ) => {},
    setAssetBounds: (state, action: PayloadAction<{ atBound: boolean }>) => {
      state.assets.atBound = action.payload.atBound
    },
    setAssetData: (state, action: PayloadAction<{ collection?: string; page?: number }>) => {
      state.assets.collection = action.payload.collection || 'all'
      state.assets.page = action.payload.page || 0
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
    setOrderFlowStep: (state, action: PayloadAction<{ step: NftOrderStepEnum }>) => {
      state.orderFlow.step = action.payload.step
    }
  }
})

const { actions } = nftsSlice
const nftsReducer = nftsSlice.reducer
export { actions, nftsReducer }
