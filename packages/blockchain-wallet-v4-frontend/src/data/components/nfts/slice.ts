/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import {
  ExplorerGatewaySearchType,
  GasCalculationOperations,
  GasDataI,
  NftAsset,
  NftOrder,
  NftUserPreferencesReturnType,
  NftUserPreferencesType,
  OpenSeaStatus,
  OwnerNftBalance,
  SeaportRawOrder,
  UnsignedOrder,
  WyvernRawOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await } from '@core/types'

import { NftOrderStatusEnum, NftOrderStepEnum, NftsStateType } from './types'

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
  collection: Remote.NotAsked,
  collections: Remote.NotAsked,
  nftOwnerAssets: Remote.NotAsked,
  openSeaAsset: Remote.NotAsked,
  openSeaStatus: Remote.NotAsked,
  orderFlow: {
    fees: Remote.NotAsked,
    isSubmitting: false,
    matchingOrder_LEGACY: Remote.NotAsked,
    prevStep: null,
    seaportOrder: null,
    status: null,
    step: null,
    userHasPendingTxR: Remote.NotAsked,
    viewOrder: null,
    wrapEthFees: Remote.NotAsked,
    wyvernOrder: null
  },
  search: Remote.NotAsked,
  userPreferences: Remote.NotAsked
}

const nftsSlice = createSlice({
  initialState,
  name: 'nfts',
  reducers: {
    acceptOffer: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        gasData: GasDataI
        seaportOrder: SeaportRawOrder
      }>
    ) => {},
    acceptOffer_LEGACY: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        buy: UnsignedOrder
        gasData: GasDataI
        sell: UnsignedOrder
      }>
    ) => {},
    cancelListing: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        gasData: GasDataI
        seaportOrder: SeaportRawOrder | null
      }>
    ) => {},
    cancelListing_LEGACY: (
      state,
      action: PayloadAction<{ asset: NftAsset; gasData: GasDataI; order: WyvernRawOrder }>
    ) => {},
    cancelOffer: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        gasData: GasDataI
        seaportOrder: SeaportRawOrder | null
      }>
    ) => {},
    cancelOffer_LEGACY: (
      state,
      action: PayloadAction<{ asset: NftAsset; gasData: GasDataI; order: WyvernRawOrder | null }>
    ) => {},
    createListing: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        endPrice: number | null
        expirationMinutes: number
        gasData: GasDataI
        paymentTokenAddress: string | undefined
        reservePrice: number | undefined
        startPrice: number
        waitForHighestBid: boolean | undefined
      }>
    ) => {},
    createListing_LEGACY: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        endPrice: number | null
        expirationMinutes: number
        gasData: GasDataI
        paymentTokenAddress: string | undefined
        reservePrice: number | undefined
        startPrice: number
        waitForHighestBid: boolean | undefined
      }>
    ) => {},
    createOffer: (
      state,
      action: PayloadAction<{
        amount?: string
        amtToWrap?: string
        asset: NftAsset
        coin?: string
        expirationTime: number
        offerFees: GasDataI
        wrapFees: GasDataI
      }>
    ) => {},
    createOffer_LEGACY: (
      state,
      action: PayloadAction<{
        amount?: string
        amtToWrap?: string
        asset: NftAsset
        coin?: string
        expirationTime: number
        offerFees: GasDataI
        wrapFees?: GasDataI
      }>
    ) => {},
    createOrder: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        gasData: GasDataI
        seaportOrder: SeaportRawOrder
      }>
    ) => {},
    createOrder_LEGACY: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        buy: NftOrder
        gasData: GasDataI
        sell: NftOrder
      }>
    ) => {},
    createTransfer: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        gasData: GasDataI
        to: string
      }>
    ) => {},
    fetchFees: (
      state,
      action: PayloadAction<
        | {
            offer: SeaportRawOrder
            operation: GasCalculationOperations.AcceptOffer
          }
        | {
            operation: GasCalculationOperations.Buy
            order: SeaportRawOrder
            paymentTokenAddress?: string
          }
        | {
            asset: NftAsset
            operation: GasCalculationOperations.Transfer
            to: string
          }
        | {
            amount?: string
            amtToWrap?: string
            asset: NftAsset
            coin?: string
            expirationTime?: number
            operation: GasCalculationOperations.CreateOffer
          }
        | {
            asset: NftAsset
            operation: GasCalculationOperations.Sell
          }
        | {
            operation: GasCalculationOperations.CancelOrder
            order: SeaportRawOrder
          }
        | {
            offer: SeaportRawOrder
            operation: GasCalculationOperations.CancelOffer
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
    fetchFeesWrapEth: (
      state,
      action: PayloadAction<{ operation: GasCalculationOperations.WrapEth }>
    ) => {},

    fetchFeesWrapEthFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.wrapEthFees = Remote.Failure(action.payload)
    },
    fetchFeesWrapEthLoading: (state) => {
      state.orderFlow.wrapEthFees = Remote.Loading
    },
    fetchFeesWrapEthSuccess: (
      state,
      action: PayloadAction<Await<ReturnType<typeof calculateGasFees>>>
    ) => {
      state.orderFlow.wrapEthFees = Remote.Success(action.payload)
    },
    fetchFees_LEGACY: (
      state,
      action: PayloadAction<
        | {
            operation: GasCalculationOperations.AcceptOffer
            order: WyvernRawOrder
          }
        | {
            asset: NftAsset
            offer: string
            operation: GasCalculationOperations.CreateOffer
            paymentTokenAddress: string
          }
        | {
            operation: GasCalculationOperations.Buy
            order: WyvernRawOrder
            paymentTokenAddress?: string
          }
        | {
            asset: NftAsset
            endPrice?: number
            expirationMinutes: number
            operation: GasCalculationOperations.Sell
            paymentTokenAddress?: string
            reservePrice?: number
            startPrice: number
            waitForHighestBid?: boolean
          }
        | {
            asset: NftAsset
            operation: GasCalculationOperations.Transfer
            to: string
          }
        | {
            operation: GasCalculationOperations.Cancel
            order: WyvernRawOrder
          }
      >
    ) => {},
    fetchFees_LEGACY_Failure: (state, action: PayloadAction<string>) => {
      state.orderFlow.fees = Remote.Failure(action.payload)
    },
    fetchFees_LEGACY_Loading: (state) => {
      state.orderFlow.fees = Remote.Loading
    },
    fetchFees_LEGACY_Success: (
      state,
      action: PayloadAction<Await<ReturnType<typeof calculateGasFees>>>
    ) => {
      state.orderFlow.fees = Remote.Success(action.payload)
    },
    fetchLatestPendingTxsFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.userHasPendingTxR = Remote.Failure(action.payload)
    },
    fetchLatestPendingTxsLoading: (state) => {
      state.orderFlow.userHasPendingTxR = Remote.Loading
    },
    fetchLatestPendingTxsSuccess: (state, action: PayloadAction<boolean>) => {
      state.orderFlow.userHasPendingTxR = Remote.Success(action.payload)
    },
    fetchMatchingOrder_LEGACY: (state) => {},
    fetchMatchingOrder_LEGACY_Failure: (state, action: PayloadAction<string>) => {
      state.orderFlow.matchingOrder_LEGACY = Remote.Failure(action.payload)
    },
    fetchMatchingOrder_LEGACY_Loading: (state) => {
      state.orderFlow.matchingOrder_LEGACY = Remote.Loading
    },
    fetchMatchingOrder_LEGACY_Success: (
      state,
      action: PayloadAction<{ buy: NftOrder; sell: NftOrder }>
    ) => {
      state.orderFlow.matchingOrder_LEGACY = Remote.Success(action.payload)
    },
    fetchNftOrderAsset: () => {},
    fetchNftOwnerAssets: (
      state,
      action: PayloadAction<{
        defaultEthAddr: string
      }>
    ) => {},
    fetchNftOwnerAssetsFailure: (state, action: PayloadAction<OwnerNftBalance>) => {
      state.nftOwnerAssets = Remote.Failure(action.payload)
    },
    fetchNftOwnerAssetsLoading: (state) => {
      state.nftOwnerAssets = Remote.Loading
    },
    fetchNftOwnerAssetsSuccess: (state, action: PayloadAction<OwnerNftBalance>) => {
      state.nftOwnerAssets = Remote.Success(action.payload)
    },
    fetchNftUserPreferences: (state) => {},
    fetchNftUserPreferencesFailure: (state, action: PayloadAction<string>) => {
      state.userPreferences = Remote.Failure(action.payload)
    },
    fetchNftUserPreferencesLoading: (state) => {
      state.userPreferences = Remote.Loading
    },
    fetchNftUserPreferencesSuccess: (
      state,
      action: PayloadAction<NftUserPreferencesReturnType>
    ) => {
      state.userPreferences = Remote.Success(action.payload)
    },
    fetchOpenSeaAsset: (
      state,
      action: PayloadAction<{
        asset_contract_address: string
        defaultEthAddr: string | undefined
        token_id: string
      }>
    ) => {},
    fetchOpenSeaAssetFailure: (state, action: PayloadAction<string>) => {
      state.openSeaAsset = Remote.Failure(action.payload)
    },
    fetchOpenSeaAssetLoading: (state) => {
      state.openSeaAsset = Remote.Loading
    },
    fetchOpenSeaAssetSuccess: (state, action: PayloadAction<NftAsset>) => {
      state.openSeaAsset = Remote.Success(action.payload)
    },
    fetchOpenseaStatus: () => {},
    fetchOpenseaStatusFailure: (state, action: PayloadAction<OpenSeaStatus>) => {
      state.openSeaStatus = Remote.Failure(action.payload)
    },
    fetchOpenseaStatusLoading: (state) => {
      state.openSeaStatus = Remote.Loading
    },
    fetchOpenseaStatusSuccess: (state, action: PayloadAction<OpenSeaStatus>) => {
      state.openSeaStatus = Remote.Success(action.payload)
    },
    handleRouterChange: (state, action: PayloadAction<{ location: { pathname: string } }>) => {},
    nftOrderFlowClose: (state) => {
      state.orderFlow = initialState.orderFlow
    },
    nftOrderFlowOpen: (
      state,
      action: PayloadAction<
        | {
            asset_contract_address: string
            seaportOrder: SeaportRawOrder
            step: NftOrderStepEnum.CANCEL_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            seaportOrder: SeaportRawOrder
            step: NftOrderStepEnum.ACCEPT_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            seaportOrder: SeaportRawOrder
            step: NftOrderStepEnum.BUY
            token_id: string
          }
        | {
            asset_contract_address: string
            seaportOrder: SeaportRawOrder
            step: NftOrderStepEnum.CANCEL_LISTING
            token_id: string
          }
        | {
            asset_contract_address: string
            seaportOrder?: never
            step: NftOrderStepEnum.MAKE_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            seaportOrder?: never
            step: NftOrderStepEnum
            token_id: string
          }
        | {
            seaportOrder?: never
            step: NftOrderStepEnum
          }
      >
    ) => {
      state.orderFlow.step = action.payload.step

      if (action.payload.seaportOrder) {
        state.orderFlow.seaportOrder = action.payload.seaportOrder
      }
      // @ts-ignore
      if (action.payload.wyvernOrder) {
        // @ts-ignore
        state.orderFlow.wyvernOrder = action.payload.wyvernOrder
      }
    },
    nftOrderFlowOpen_LEGACY: (
      state,
      action: PayloadAction<
        | {
            asset_contract_address: string
            order: WyvernRawOrder
            step: NftOrderStepEnum.CANCEL_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            order: WyvernRawOrder
            step: NftOrderStepEnum.ACCEPT_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            order: WyvernRawOrder
            step: NftOrderStepEnum.BUY
            token_id: string
          }
        | {
            asset_contract_address: string
            order: WyvernRawOrder
            step: NftOrderStepEnum.CANCEL_LISTING
            token_id: string
          }
        | {
            asset_contract_address: string
            order?: never
            step: NftOrderStepEnum.MAKE_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            order?: never
            step: NftOrderStepEnum
            token_id: string
          }
      >
    ) => {
      state.orderFlow.step = action.payload.step

      if (action.payload.order) {
        state.orderFlow.wyvernOrder = action.payload.order
      }
    },
    nftSearch: (state, action: PayloadAction<{ search: string }>) => {},
    nftSearchFailure: (state, action: PayloadAction<string>) => {
      state.search = Remote.Failure(action.payload)
    },
    nftSearchLoading: (state) => {
      state.search = Remote.Loading
    },
    nftSearchSuccess: (state, action: PayloadAction<ExplorerGatewaySearchType>) => {
      state.search = Remote.Success(action.payload)
    },
    resetNftAssets: (state) => {
      state.assets.atBound = false
      state.assets.page = 0
      state.assets.isLoading = false
      state.assets.list = []
    },
    resetNftFees: (state) => {
      state.orderFlow.fees = Remote.NotAsked
    },
    setActiveSlug: (state, action: PayloadAction<{ slug: string }>) => {
      state.activeSlug = action.payload.slug
    },
    setAssetBounds: (state, action: PayloadAction<{ atBound: boolean }>) => {
      state.assets.atBound = action.payload.atBound
    },
    setAssetData: (state, action: PayloadAction<{ collection?: string; page?: number }>) => {
      state.assets.collection = action.payload.collection || 'all'
      state.assets.page = action.payload.page || 0
    },
    setNftOrderStatus: (state, action: PayloadAction<NftOrderStatusEnum>) => {
      state.orderFlow.status = action.payload
    },
    setOrderFlowIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.orderFlow.isSubmitting = action.payload
    },
    setOrderFlowPrevStep: (state, action: PayloadAction<{ prevStep: NftOrderStepEnum }>) => {
      state.orderFlow.prevStep = action.payload.prevStep
    },
    setOrderFlowStep: (state, action: PayloadAction<{ step: NftOrderStepEnum }>) => {
      state.orderFlow.step = action.payload.step
    },
    setViewOrder: (state, action: PayloadAction<{ viewOrder: NftAsset }>) => {
      state.orderFlow.viewOrder = action.payload.viewOrder
    },
    updateUserPreferences: (
      state,
      action: PayloadAction<{ userPrefs: NftUserPreferencesType }>
    ) => {}
  }
})

const { actions } = nftsSlice
const nftsReducer = nftsSlice.reducer
export { actions, nftsReducer }
