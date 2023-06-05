import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { DexChain, DexToken } from '@core/network/api/dex'
import Remote from '@core/remote'
import { CoinType } from '@core/types'
import { notReachable } from 'utils/helpers'

import type { DexStateType, DexSwapQuoteWithDate, ParsedTx, SwapQuoteSuccess } from './types'

const initialState: DexStateType = {
  chains: Remote.NotAsked,
  currentChain: Remote.NotAsked, // TODO: might not need Remote type
  currentChainTokens: Remote.NotAsked,
  isTokenAllowed: Remote.NotAsked,
  isTokenAllowedAfterPolling: Remote.NotAsked,
  isUserEligible: Remote.NotAsked,
  search: '',
  searchedTokens: Remote.Success([]),
  sendSwapQuote: Remote.NotAsked,
  swapQuote: Remote.NotAsked,
  tokenAllowanceGasEstimate: '',
  tokenAllowanceTx: Remote.NotAsked
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
    fetchSwapQuote: () => {},
    fetchSwapQuoteFailure: (state, action: PayloadAction<string>) => {
      state.swapQuote = Remote.Failure(action.payload)
    },
    fetchSwapQuoteLoading: (state) => {
      state.swapQuote = Remote.Loading
    },
    fetchSwapQuoteSuccess: (state, action: PayloadAction<DexSwapQuoteWithDate>) => {
      state.swapQuote = Remote.Success(action.payload)
    },
    fetchTokenAllowance: (state, action: PayloadAction<{ baseToken: CoinType }>) => {},
    fetchTokenAllowanceFailure: (state, action: PayloadAction<string>) => {
      state.isTokenAllowed = Remote.Failure(action.payload)
    },
    fetchTokenAllowanceLoading: (state) => {
      state.isTokenAllowed = Remote.Loading
    },
    fetchTokenAllowanceSuccess: (state, action: PayloadAction<boolean>) => {
      state.isTokenAllowed = Remote.Success(action.payload)
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
    pollTokenAllowance: (state, action: PayloadAction<{ baseToken: CoinType }>) => {},
    pollTokenAllowanceFailure: (state, action: PayloadAction<string>) => {
      state.isTokenAllowedAfterPolling = Remote.Failure(action.payload)
    },
    pollTokenAllowanceLoading: (state) => {
      state.isTokenAllowedAfterPolling = Remote.Loading
    },
    pollTokenAllowanceSuccess: (state, action: PayloadAction<boolean>) => {
      state.isTokenAllowedAfterPolling = Remote.Success(action.payload)
    },
    pollTokenAllowanceTx: (state, action: PayloadAction<{ baseToken: string }>) => {},
    pollTokenAllowanceTxFailure: (state, action: PayloadAction<string>) => {
      state.tokenAllowanceTx = Remote.Failure(action.payload)
    },
    pollTokenAllowanceTxLoading: (state) => {
      state.tokenAllowanceTx = Remote.Loading
    },
    pollTokenAllowanceTxSuccess: (state, action: PayloadAction<ParsedTx>) => {
      state.tokenAllowanceTx = Remote.Success(action.payload)
    },
    resetTokenAllowance: (state) => {
      state.isTokenAllowed = Remote.NotAsked
      state.isTokenAllowedAfterPolling = Remote.NotAsked
      state.tokenAllowanceGasEstimate = ''
      state.tokenAllowanceTx = Remote.NotAsked
    },
    sendSwapQuote: (state, action: PayloadAction<{ baseToken: string }>) => {},
    sendSwapQuoteFailure: (state, action: PayloadAction<string>) => {
      state.sendSwapQuote = Remote.Failure(action.payload)
    },
    sendSwapQuoteLoading: (state) => {
      state.sendSwapQuote = Remote.Loading
    },
    sendSwapQuoteSuccess: (state, action: PayloadAction<SwapQuoteSuccess>) => {
      state.sendSwapQuote = Remote.Success(action.payload)
    },
    sendTokenAllowanceTx: (state, action: PayloadAction<{ baseToken: string }>) => {},
    sendTokenAllowanceTxFailure: (state, action: PayloadAction<string>) => {
      state.isTokenAllowedAfterPolling = Remote.Failure(action.payload)
    },
    setCurrentChain: (state, action: PayloadAction<DexChain>) => {
      state.currentChain = Remote.Success(action.payload)
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setTokenAllowanceGasEstimate: (state, action: PayloadAction<string>) => {
      state.tokenAllowanceGasEstimate = action.payload
    },
    stopPollSwapQuote: () => {},
    stopPollTokenAllowance: () => {},
    stopPollTokenAllowanceTx: () => {}
  }
})

export const { actions } = dexSlice
export const dexReducer = dexSlice.reducer
