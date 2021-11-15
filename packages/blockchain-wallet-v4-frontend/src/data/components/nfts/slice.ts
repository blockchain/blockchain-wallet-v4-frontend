/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import {
  CollectionData,
  NftAsset,
  NftAssetsType,
  NftOrdersType,
  SellOrder
} from '@core/network/api/nfts/types'

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
  marketplace: { page: 0, token_ids_queried: [] },
  orderFlow: { activeOrder: null, asset: Remote.NotAsked, step: NftOrderStepEnum.SHOW_ASSET },
  orders: { isFailure: false, isLoading: true, list: [] }
}

const nftsSlice = createSlice({
  initialState,
  name: 'nfts',
  reducers: {
    cancelListing: (state, action: PayloadAction<{ sell_order: SellOrder }>) => {},
    cancelListingFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.cancelListing = Remote.Success(action.payload.error)
    },
    cancelListingLoading: (state) => {
      state.cancelListing = Remote.Loading
    },
    cancelListingSuccess: (state) => {
      state.cancelListing = Remote.Success(true)
    },
    createBuyOrder: (state, action: PayloadAction<{ order: NftOrdersType['orders'][0] }>) => {},
    createSellOrder: (state, action: PayloadAction<{ asset: NftAssetsType['assets'][0] }>) => {},
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
      state.orders.isFailure = true
    },
    fetchNftOrdersLoading: (state) => {
      state.orders.isLoading = true
    },
    fetchNftOrdersSuccess: (state, action: PayloadAction<NftOrdersType['orders']>) => {
      state.orders.isFailure = false
      state.orders.isLoading = false
      state.orders.list = [...state.orders.list, ...action.payload]
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
      state.orders.isFailure = false
      state.orders.isLoading = true
      state.orders.list = []
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
    }
  }
})

const { actions } = nftsSlice
const nftsReducer = nftsSlice.reducer
export { actions, nftsReducer }
