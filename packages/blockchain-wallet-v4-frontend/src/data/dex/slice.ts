import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'

import { DexChainList, DexStateType } from './types'

const initialState: DexStateType = {
  chains: Remote.NotAsked
}

const dexSlice = createSlice({
  initialState,
  name: 'dex',
  reducers: {
    fetchDexChains: () => {},
    fetchDexChainsFailure: (state, action: PayloadAction<string>) => {
      state.chains = Remote.Failure(action.payload)
    },
    fetchDexChainsLoading: (state) => {
      state.chains = Remote.Loading
    },
    fetchDexChainsSuccess: (state, action: PayloadAction<DexChainList>) => {
      state.chains = Remote.Success(action.payload)
    }
  }
})

export const { actions } = dexSlice
export const dexReducer = dexSlice.reducer
