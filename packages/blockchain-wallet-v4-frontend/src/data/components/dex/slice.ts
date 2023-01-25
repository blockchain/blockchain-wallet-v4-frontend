import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { DexChain, DexSwapQuote, DexToken } from '@core/network/api/dex'
import Remote from '@core/remote'
import { notReachable } from 'utils/helpers'

import type { DexStateType } from './types'

const initialState: DexStateType = {
  chains: Remote.NotAsked,
  currentChain: Remote.NotAsked, // TODO: might not need Remote type
  currentChainTokens: Remote.NotAsked,
  currentChainTokensMeta: { count: 0, status: 'LOADED' },
  isUserEligible: Remote.NotAsked,
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
          state.currentChainTokensMeta.status = 'LOADED'
          state.currentChainTokensMeta.count = 0
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
      state.currentChainTokensMeta.status = 'LOADED'
    },
    fetchChainTokensLoading: (state) => {
      if (state.currentChainTokensMeta.count === 0) {
        state.currentChainTokens = Remote.Loading
      } else {
        state.currentChainTokensMeta.status = 'LOADING_MORE'
      }
    },
    fetchChainTokensSuccess: (
      state,
      action: PayloadAction<{ data: DexToken[]; type: 'RELOAD' | 'LOAD_MORE' }>
    ) => {
      switch (action.payload.type) {
        case 'RELOAD':
          state.currentChainTokensMeta.status = 'LOADED'
          state.currentChainTokensMeta.count = action.payload.data.length
          state.currentChainTokens = Remote.Success(action.payload.data)
          break
        case 'LOAD_MORE':
          state.currentChainTokensMeta.status =
            action.payload.data.length > 0 ? 'LOADED' : 'NO_MORE_TOKENS'
          state.currentChainTokensMeta.count += action.payload.data.length
          state.currentChainTokens = Remote.Success([
            ...state.currentChainTokens.getOrElse([]),
            ...action.payload.data
          ])
          break
        default:
          notReachable(action.payload.type)
      }
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
