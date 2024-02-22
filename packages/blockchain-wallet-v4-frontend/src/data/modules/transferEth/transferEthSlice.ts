import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { TransferEthState } from './types'

const initialState: TransferEthState = {
  payment: Remote.NotAsked
}

const trasnferEthSlice = createSlice({
  initialState,
  name: 'transferEth',
  reducers: {
    confirmTransferEth: (
      state,
      action: PayloadAction<{ effectiveBalance: string | number; to: string | number }>
    ) => {},
    transferEthInitialized: (state, action: PayloadAction<{ from: string; type: 'LEGACY' }>) => {
      state.payment = Remote.NotAsked
    },
    transferEthPaymentUpdatedFailure: (state, action) => {
      state.payment = Remote.Failure(action.payload)
    },
    transferEthPaymentUpdatedLoading: (state) => {
      state.payment = Remote.Loading
    },
    transferEthPaymentUpdatedSuccess: (state, action) => {
      state.payment = Remote.Success(action.payload)
    }
  }
})

export const { actions } = trasnferEthSlice
export const transferEthReducer = trasnferEthSlice.reducer
