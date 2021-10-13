/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { NftAssetsType } from '@core/network/api/nfts/types'
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
  assets: Remote.NotAsked
}

const nftsSlice = createSlice({
  initialState,
  name: 'nfts',
  reducers: {
    fetchNftAssets: () => {},
    fetchNftAssetsFailure: (state, action: PayloadAction<string>) => {
      state.assets = Remote.Failure(action.payload)
    },
    fetchNftAssetsLoading: (state) => {
      state.assets = Remote.Loading
    },
    fetchNftAssetsSuccess: (state, action: PayloadAction<NftAssetsType['assets']>) => {
      state.assets = Remote.Success(action.payload)
    }
  }
})

const { actions } = nftsSlice
const nftsReducer = nftsSlice.reducer
export { actions, nftsReducer }
