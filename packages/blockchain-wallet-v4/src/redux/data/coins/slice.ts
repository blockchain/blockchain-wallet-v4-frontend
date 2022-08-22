import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IndexMultiResponseType, TickerResponseType } from '@core/network/api/coins/types'

import Remote from '../../../remote'
import { CoinsState } from './types'

const initialState: CoinsState = {
  btcTicker: Remote.NotAsked,
  isCoinDataLoaded: false,
  rates: Remote.NotAsked,
  transactions: {},
  transactions_at_bound: {}
}

export const coinsSlice = createSlice({
  initialState,
  name: 'coins',
  reducers: {
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
    fetchTransactions: (state, action: PayloadAction<{ coin: string; reset?: boolean }>) => {},
    fetchTransactionsFailure: (state, action: PayloadAction<{ coin: string; error: string }>) => {
      state.transactions = {
        ...state.transactions,
        [action.payload.coin]: [Remote.Failure(action.payload.error)]
      }
    },
    fetchTransactionsLoading: (state, action: PayloadAction<{ coin: string; reset?: boolean }>) => {
      state.transactions = {
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
            (tx, i) => i !== state.transactions[action.payload.coin].length - 1
          ),
          Remote.Success(action.payload.transactions)
        ]
      }
    },
    pollForCoinData: () => {},
    setCoinDataLoaded: (state) => {
      state.isCoinDataLoaded = true
    },
    setTransactionsAtBound: (state, action: PayloadAction<{ atBound: boolean; coin: string }>) => {
      state.transactions_at_bound = {
        ...state.transactions_at_bound,
        [action.payload.coin]: action.payload.atBound
      }
    }
  }
})

export const { actions } = coinsSlice
export const coinsReducer = coinsSlice.reducer
