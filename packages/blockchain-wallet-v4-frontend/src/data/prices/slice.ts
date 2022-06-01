import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'

import { CoinPricesRequestType, PricesStateType } from './types'

const createPricesKvPairs = (prices) => {
  return Object.keys(prices).reduce((pricesMap, priceKey) => {
    const coinPrice = prices[priceKey]

    if (!coinPrice) return pricesMap

    const coinCode = priceKey.split('-')[0]

    return {
      ...pricesMap,
      [coinCode]: coinPrice
    }
  }, {})
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
      reducer: () => {}
    },
    fetchCoinPricesFailure: (state, action: PayloadAction<PartialClientErrorProperties>) => {
      state.current = Remote.Failure(action.payload)
    },
    fetchCoinPricesLoading: (state) => {
      state.current = Remote.Loading
    },
    fetchCoinPricesPreviousDay: {
      prepare: (request?: CoinPricesRequestType) => ({ payload: request || {} }),
      reducer: () => {}
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
