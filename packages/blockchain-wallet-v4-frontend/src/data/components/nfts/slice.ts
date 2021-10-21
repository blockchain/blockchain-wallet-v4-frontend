/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { NftAssetsType, NftOrdersType } from '@core/network/api/nfts/types'
import {
  CoinType,
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
  PaymentValue,
  ProviderDetailsType,
  SBAccountType,
  SBBalancesType,
  SBCardType,
  SBOrderActionType,
  SBOrderType,
  SBPairsType,
  SBPairType,
  SBPaymentMethodsType,
  SBPaymentMethodType,
  SBPaymentTypes,
  SBQuoteType,
  SDDEligibleType,
  SDDVerifiedType,
  SwapQuoteType,
  SwapUserLimitsType
} from '@core/types'
import {
  BankTransferAccountType,
  InitializeCheckout,
  ModalOriginType,
  SBFixType,
  SBShowModalOriginType,
  StepActionsPayload,
  SwapAccountType
} from 'data/types'

import { NftsStateType } from './types'

const initialState: NftsStateType = {
  assets: Remote.NotAsked,
  orders: Remote.NotAsked
}

const nftsSlice = createSlice({
  initialState,
  name: 'nfts',
  reducers: {
    createBuyOrder: (state, action: PayloadAction<{ order: NftOrdersType['orders'][0] }>) => {},
    createSellOrder: (state, action: PayloadAction<{ asset: NftAssetsType['assets'][0] }>) => {},
    fetchNftAssets: () => {},
    fetchNftAssetsFailure: (state, action: PayloadAction<string>) => {
      state.assets = Remote.Failure(action.payload)
    },
    fetchNftAssetsLoading: (state) => {
      state.assets = Remote.Loading
    },
    fetchNftAssetsSuccess: (state, action: PayloadAction<NftAssetsType['assets']>) => {
      state.assets = Remote.Success(action.payload)
    },
    fetchNftOrders: () => {},
    fetchNftOrdersFailure: (state, action: PayloadAction<string>) => {
      state.orders = Remote.Failure(action.payload)
    },
    fetchNftOrdersLoading: (state) => {
      state.orders = Remote.Loading
    },
    fetchNftOrdersSuccess: (state, action: PayloadAction<NftOrdersType['orders']>) => {
      state.orders = Remote.Success(action.payload)
    }
  }
})

const { actions } = nftsSlice
const nftsReducer = nftsSlice.reducer
export { actions, nftsReducer }
