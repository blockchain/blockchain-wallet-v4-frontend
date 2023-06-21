import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { DexChain, DexToken } from '@core/network/api/dex'
import Remote from '@core/remote'
import { CoinType } from '@core/types'

import type {
  DexStateType,
  DexSwapQuoteWithDate,
  ParsedTx,
  QuoteError,
  SwapQuoteSuccess
} from './types'

const initialState: DexStateType = {
  chainTokens: Remote.NotAsked,
  chains: Remote.NotAsked,
  currentChain: Remote.NotAsked, // TODO: might not need Remote type
  isTokenAllowed: Remote.NotAsked,
  isTokenAllowedAfterPolling: Remote.NotAsked,
  isUserEligible: Remote.NotAsked,
  swapQuote: Remote.NotAsked,
  swapQuoteTx: Remote.NotAsked,
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
    fetchChainTokens: () => {},
    fetchChainTokensFailure: (state, action: PayloadAction<string>) => {
      state.chainTokens = Remote.Failure(action.payload)
    },
    fetchChainTokensLoading: (state) => {
      state.chainTokens = Remote.Loading
    },
    fetchChainTokensSuccess: (state, action: PayloadAction<{ data: DexToken[] }>) => {
      state.chainTokens = Remote.Success(action.payload.data)
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
    fetchSwapQuote: () => {},
    fetchSwapQuoteFailure: (state, action: PayloadAction<QuoteError>) => {
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
    sendSwapQuote: () => {},
    sendSwapQuoteFailure: (state, action: PayloadAction<string>) => {
      state.swapQuoteTx = Remote.Failure(action.payload)
    },
    sendSwapQuoteLoading: (state) => {
      state.swapQuoteTx = Remote.Loading
    },
    sendSwapQuoteSuccess: (state, action: PayloadAction<SwapQuoteSuccess>) => {
      state.swapQuoteTx = Remote.Success(action.payload)
    },
    sendTokenAllowanceTx: (state, action: PayloadAction<{ baseToken: string }>) => {},
    sendTokenAllowanceTxFailure: (state, action: PayloadAction<string>) => {
      state.isTokenAllowedAfterPolling = Remote.Failure(action.payload)
    },
    setCurrentChain: (state, action: PayloadAction<DexChain>) => {
      state.currentChain = Remote.Success(action.payload)
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
