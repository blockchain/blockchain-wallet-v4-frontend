/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { BeneficiariesType, SwapOrderType, WalletFiatType } from '@core/types'

import { CustodialState, Products } from './types'

const initialState: CustodialState = {
  beneficiaries: Remote.NotAsked,
  products: Remote.NotAsked,
  recentSwapTxs: Remote.NotAsked
}

const custodialSlice = createSlice({
  initialState,
  name: 'custodial',
  reducers: {
    // Beneficiaries
    fetchCustodialBeneficiaries: (
      state,
      action: PayloadAction<{ currency?: WalletFiatType }>
    ) => {},
    fetchCustodialBeneficiariesFailure: (state, action: PayloadAction<string>) => {
      state.beneficiaries = Remote.Failure(action.payload)
    },
    fetchCustodialBeneficiariesLoading: (state) => {
      state.beneficiaries = Remote.Loading
    },
    fetchCustodialBeneficiariesSuccess: (state, action: PayloadAction<BeneficiariesType>) => {
      state.beneficiaries = Remote.Success(action.payload)
    },

    // Products
    fetchProducts: () => {},
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.products = Remote.Failure(action.payload)
    },
    fetchProductsLoading: (state) => {
      state.products = Remote.Loading
    },
    fetchProductsSuccess: (state, action: PayloadAction<Products>) => {
      state.products = Remote.Success(action.payload)
    },

    // Swap Tx
    fetchRecentSwapTxs: () => {},
    fetchRecentSwapTxsFailure: (state, action: PayloadAction<string>) => {
      state.recentSwapTxs = Remote.Failure(action.payload)
    },
    fetchRecentSwapTxsLoading: (state) => {
      state.recentSwapTxs = Remote.Loading
    },
    fetchRecentSwapTxsSuccess: (state, action: PayloadAction<SwapOrderType[]>) => {
      state.recentSwapTxs = Remote.Success(action.payload)
    }
  }
})

const { actions } = custodialSlice
const custodialReducer = custodialSlice.reducer
export { actions, custodialReducer }
