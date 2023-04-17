import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { DexChain, DexSwapQuote, DexToken } from '@core/network/api/dex'
import Remote from '@core/remote'
import { notReachable } from 'utils/helpers'

import type { DexStateType } from './types'

const initialState: DexStateType = {
  chains: Remote.NotAsked,
  currentChain: Remote.NotAsked, // TODO: might not need Remote type
  currentChainTokens: Remote.NotAsked,
  isUserEligible: Remote.NotAsked,
  searchedTokens: Remote.NotAsked,
  swapQuote: Remote.NotAsked
}

const dexSlice = createSlice({
  initialState,
  name: 'dex',
  reducers: {
    clearCurrentSwapQuote: (state) => {
      state.swapQuote = Remote.NotAsked
    },
    fetchChainTokens: (
      state,
      action: PayloadAction<{ search: string; type: 'RELOAD' | 'LOAD_MORE' }>
    ) => {
      switch (action.payload.type) {
        case 'RELOAD':
          state.currentChainTokens = Remote.Success([])
          break
        case 'LOAD_MORE':
          break
        default:
          notReachable(action.payload.type)
      }
    },
    fetchChainTokensFailure: (state, action: PayloadAction<string>) => {
      state.currentChainTokens = Remote.Failure(action.payload)
    },
    fetchChainTokensLoading: (state) => {
      state.currentChainTokens = Remote.Loading
    },
    fetchChainTokensSuccess: (state, action: PayloadAction<{ data: DexToken[] }>) => {
      state.currentChainTokens = Remote.Success(action.payload.data)
    },
    fetchChains: () => {},
    fetchChainsFailure: (state, action: PayloadAction<string>) => {
      state.chains = Remote.Failure(action.payload)
    },
    fetchChainsLoading: (state) => {
      state.chains = Remote.Loading
    },
    fetchChainsSuccess: (state, action: PayloadAction<DexChain[]>) => {
      state.chains = Remote.Success(action.payload)
    },
    fetchSearchedTokens: (state, action: PayloadAction<{ search: string }>) => {},
    fetchSearchedTokensFailure: (state, action: PayloadAction<string>) => {
      state.searchedTokens = Remote.Failure(action.payload)
    },
    fetchSearchedTokensLoading: (state) => {
      state.searchedTokens = Remote.Loading
    },
    fetchSearchedTokensSuccess: (state, action: PayloadAction<DexToken[]>) => {
      state.searchedTokens = Remote.Success(action.payload)
    },
    fetchSwapQuoteFailure: (state, action: PayloadAction<string>) => {
      state.swapQuote = Remote.Failure(action.payload)
    },
    fetchSwapQuoteLoading: (state) => {
      state.swapQuote = Remote.Loading
    },
    fetchSwapQuoteSuccess: (state, action: PayloadAction<DexSwapQuote>) => {
      state.swapQuote = Remote.Success(action.payload)
    },
    fetchUserEligibility: () => {},
    fetchUserEligibilityFailure: (state, action: PayloadAction<string>) => {
      state.isUserEligible = Remote.Failure(action.payload)
    },
    fetchUserEligibilityLoading: (state) => {
      state.isUserEligible = Remote.Loading
    },
    fetchUserEligibilitySuccess: (state, action: PayloadAction<boolean>) => {
      state.isUserEligible = Remote.Success(action.payload)
    },
    setCurrentChain: (state, action: PayloadAction<DexChain>) => {
      state.currentChain = Remote.Success(action.payload)
    }
  }
})

export const { actions } = dexSlice
export const dexReducer = dexSlice.reducer
