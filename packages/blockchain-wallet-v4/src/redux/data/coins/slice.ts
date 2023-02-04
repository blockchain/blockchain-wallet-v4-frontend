import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  IndexMultiResponseType,
  TickerResponseType,
  UnifiedBalancesResponseType
} from '@core/network/api/coins/types'

import Remote from '../../../remote'
import { CoinsState } from './types'

const initialState: CoinsState = {
  btcTicker: Remote.NotAsked,
  isCoinDataLoaded: false,
  rates: Remote.NotAsked,
  subscriptions: Remote.NotAsked,
  transaction_history: {},
  transactions: {},
  transactions_at_bound: {},
  unifiedBalances: Remote.NotAsked
}

export const coinsSlice = createSlice({
  initialState,
  name: 'coins',
  reducers: {
    clearTransactionHistory: (state, action: PayloadAction<{ coin: string }>) => {
      state.transaction_history = {
        ...state.transaction_history,
        [action.payload.coin]: Remote.NotAsked
      }
    },
    fetchBtcTicker: () => {},
    fetchBtcTickerFailure: (state, action: PayloadAction<string>) => {
      state.btcTicker = Remote.Failure(action.payload)
    },
    fetchBtcTickerLoading: (state) => {
      state.btcTicker = Remote.Loading
    },
    fetchBtcTickerSuccess: (state, action: PayloadAction<TickerResponseType>) => {
      state.btcTicker = Remote.Success(action.payload)
    },
    fetchCoinsRates: () => {},
    fetchCoinsRatesFailure: (state, action: PayloadAction<string>) => {
      state.rates = Remote.Failure(action.payload)
    },
    fetchCoinsRatesLoading: (state) => {
      state.rates = Remote.Loading
    },
    fetchCoinsRatesSuccess: (state, action: PayloadAction<{ rates: IndexMultiResponseType }>) => {
      state.rates = Remote.Success(action.payload.rates)
    },
    fetchTransactionHistory: (
      // @typescript-eslint/no-unused-vars
      _state,
      // @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ coin: string; reset?: boolean }>
    ) => {},
    fetchTransactionHistoryFailure: (
      state,
      action: PayloadAction<{ coin: string; error: string }>
    ) => {
      state.transaction_history = {
        ...state.transaction_history,
        [action.payload.coin]: Remote.Failure(action.payload.error)
      }
    },
    fetchTransactionHistoryLoading: (
      state,
      action: PayloadAction<{ coin: string; reset?: boolean }>
    ) => {
      state.transaction_history = {
        ...state.transaction_history,
        [action.payload.coin]: Remote.Loading
      }
    },
    fetchTransactionHistorySuccess: (
      state,
      action: PayloadAction<{ coin: string; transactions }>
    ) => {
      state.transaction_history = {
        ...state.transaction_history,
        [action.payload.coin]: Remote.Success(action.payload.transactions)
      }
    },
    fetchTransactions: (_state, _action: PayloadAction<{ coin: string; reset?: boolean }>) => {},
    fetchTransactionsFailure: (state, action: PayloadAction<{ coin: string; error: string }>) => {
      state.transactions = {
        ...state.transactions,
        [action.payload.coin]: [Remote.Failure(action.payload.error)]
      }
    },
    fetchTransactionsLoading: (state, action: PayloadAction<{ coin: string; reset?: boolean }>) => {
      state.transactions = {
        ...state.transactions,
        [action.payload.coin]: action.payload.reset
          ? [Remote.Loading]
          : [...state.transactions[action.payload.coin], Remote.Loading]
      }
    },
    fetchTransactionsSuccess: (state, action: PayloadAction<{ coin: string; transactions }>) => {
      state.transactions = {
        ...state.transactions,
        [action.payload.coin]: [
          ...state.transactions[action.payload.coin].filter(
            (_tx, i) => i !== state.transactions[action.payload.coin].length - 1
          ),
          Remote.Success(action.payload.transactions)
        ]
      }
    },
    fetchUnifiedBalances: () => {},
    fetchUnifiedBalancesFailure: (state, action: PayloadAction<string>) => {
      state.unifiedBalances = Remote.Failure(action.payload)
    },
    fetchUnifiedBalancesLoading: (state) => {
      state.unifiedBalances = Remote.Loading
    },
    fetchUnifiedBalancesSuccess: (
      state,
      action: PayloadAction<UnifiedBalancesResponseType['currencies']>
    ) => {
      state.unifiedBalances = Remote.Success(action.payload)
    },
    fetchUnifiedBalancesWebService: (state, action) => {
      state.transactions = {
        ...state.transactions,
        [action.payload.coin]: Remote.Success(action.payload.transactions)
      }
    },
    getSubscriptions: () => {},
    getSubscriptionsFailure: () => {},
    getSubscriptionsLoading: (state) => {
      state.subscriptions = Remote.Loading
    },
    getSubscriptionsSuccess: (state, action: PayloadAction<any>) => {
      state.subscriptions = Remote.Success(action.payload)
    },
    initializeSubscriptions: () => {},
    pollForCoinData: () => {},
    setCoinDataLoaded: (state) => {
      state.isCoinDataLoaded = true
    },
    setTransactionsAtBound: (state, action: PayloadAction<{ atBound: boolean; coin: string }>) => {
      state.transactions_at_bound = {
        ...state.transactions_at_bound,
        [action.payload.coin]: action.payload.atBound
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribe: (_state, _action: PayloadAction<string>) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unsubscribe: (_state, _action: PayloadAction<string>) => {}
  }
})

export const { actions } = coinsSlice
export const coinsReducer = coinsSlice.reducer
