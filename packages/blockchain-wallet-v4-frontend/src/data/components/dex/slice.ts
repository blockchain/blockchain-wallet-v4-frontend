import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DexSwapQuoteErrorResponse, DexSwapQuoteSuccessResponse } from '@core/network/api/dex/types'
import Remote from '@core/remote'

import { DexChain, DexChainList, DexChainTokenList, DexStateType } from './types'

const initialState: DexStateType = {
  chains: Remote.NotAsked,
  currentChain: undefined,
  currentChainTokens: Remote.NotAsked,
  swapQuote: Remote.NotAsked
}

const dexSlice = createSlice({
  initialState,
  name: 'dex',
  reducers: {
    fetchChainTopTokens: () => {},
    fetchChainTopTokensFailure: (state, action: PayloadAction<string>) => {
      state.currentChainTokens = Remote.Failure(action.payload)
    },
    fetchChainTopTokensLoading: (state) => {
      state.currentChainTokens = Remote.Loading
    },
    fetchChainTopTokensSuccess: (state, action: PayloadAction<DexChainTokenList>) => {
      state.currentChainTokens = Remote.Success(action.payload)
    },
    fetchChains: () => {},
    fetchChainsFailure: (state, action: PayloadAction<string>) => {
      state.chains = Remote.Failure(action.payload)
    },
    fetchChainsLoading: (state) => {
      state.chains = Remote.Loading
    },
    fetchChainsSuccess: (state, action: PayloadAction<DexChainList>) => {
      state.chains = Remote.Success(action.payload)
    },
    fetchSwapQuoteFailure: (state, action: PayloadAction<DexSwapQuoteErrorResponse | string>) => {
      state.swapQuote = Remote.Failure(action.payload)
    },
    fetchSwapQuoteLoading: (state) => {
      state.swapQuote = Remote.Loading
    },
    fetchSwapQuoteSuccess: (state, action: PayloadAction<DexSwapQuoteSuccessResponse>) => {
      state.swapQuote = Remote.Success(action.payload)
    },
    setCurrentChain: (state, action: PayloadAction<DexChain>) => {
      state.currentChain = action.payload
    }
  }
})

export const { actions } = dexSlice
export const dexReducer = dexSlice.reducer
