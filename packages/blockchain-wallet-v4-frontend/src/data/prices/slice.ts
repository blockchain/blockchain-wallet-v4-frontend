import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { keys, map, mergeAll } from 'ramda'

import Remote from 'blockchain-wallet-v4/src/remote/remote'

import { CoinPricesRequestType, PricesStateType } from './types'

const createPricesKvPairs = (prices) => {
  return mergeAll(
    map(
      (x) => ({
        // @ts-ignore
        [x.split('-')[0]]: prices[x].price
      }),
      keys(prices)
    )
  )
}

const initialState: PricesStateType = {
  current: Remote.NotAsked,
  previousDay: Remote.NotAsked
}

const pricesSlice = createSlice({
  initialState,
  name: 'prices',
  reducers: {
    fetchCoinPrices: {
      prepare: (request?: CoinPricesRequestType) => ({ payload: request || {} }),
      reducer: (state, action: PayloadAction<CoinPricesRequestType>) => {}
    },
    fetchCoinPricesFailure: (state, action: PayloadAction<string>) => {
      state.current = Remote.Failure(action.payload)
    },
    fetchCoinPricesLoading: (state) => {
      state.current = Remote.Loading
    },
    fetchCoinPricesPreviousDay: {
      prepare: (request?: CoinPricesRequestType) => ({ payload: request || {} }),
      reducer: (state, action: PayloadAction<CoinPricesRequestType>) => {}
    },
    fetchCoinPricesPreviousDayFailure: (state, action: PayloadAction<string>) => {
      state.previousDay = Remote.Failure(action.payload)
    },
    fetchCoinPricesPreviousDayLoading: (state) => {
      state.previousDay = Remote.Loading
    },
    fetchCoinPricesPreviousDaySuccess: (state, action: PayloadAction<CoinPricesRequestType>) => {
      state.previousDay = Remote.Success(createPricesKvPairs(action.payload))
    },
    fetchCoinPricesSuccess: (state, action: PayloadAction<CoinPricesRequestType>) => {
      state.current = Remote.Success(createPricesKvPairs(action.payload))
    }
  }
})

export const {
  fetchCoinPrices,
  fetchCoinPricesFailure,
  fetchCoinPricesLoading,
  fetchCoinPricesPreviousDay,
  fetchCoinPricesPreviousDayFailure,
  fetchCoinPricesPreviousDayLoading,
  fetchCoinPricesPreviousDaySuccess,
  fetchCoinPricesSuccess
} = pricesSlice.actions

const { actions } = pricesSlice
const pricesReducer = pricesSlice.reducer
export { actions, pricesReducer }
