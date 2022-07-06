/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { BeneficiariesType, SwapOrderType, WalletFiatType } from '@core/types'

import { CustodialState, ProductEligibilityForUser } from './types'

const initialState: CustodialState = {
  beneficiaries: Remote.NotAsked,
  productEligibilityForUser: Remote.NotAsked,
  recentSwapTxs: Remote.NotAsked,
  userHadNotifications: false
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

    // Products Eligibility for user
    fetchProductEligibilityForUser: () => {},
    fetchProductEligibilityForUserFailure: (state, action: PayloadAction<string>) => {
      state.productEligibilityForUser = Remote.Failure(action.payload)
    },
    fetchProductEligibilityForUserLoading: (state) => {
      state.productEligibilityForUser = Remote.Loading
    },
    fetchProductEligibilityForUserSuccess: (
      state,
      action: PayloadAction<ProductEligibilityForUser>
    ) => {
      state.productEligibilityForUser = Remote.Success(action.payload)
      if (action.payload.notifications.length > 0) {
        state.userHadNotifications = true
      } else if (state.userHadNotifications) {
        state.userHadNotifications = false
      }
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
