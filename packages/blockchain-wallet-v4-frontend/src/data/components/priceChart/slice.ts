import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CoinType, TimeRange } from '@core/types'

import { CoinPayload, PriceChartType, TimePayload } from './types'

const initialState: PriceChartType = {
  coin: 'BTC',
  time: TimeRange.ALL
}

const priceChartSlice = createSlice({
  initialState,
  name: 'priceChart',
  reducers: {
    coinClicked: {
      prepare: (coin: CoinType) => ({ payload: { coin } }),
      reducer: (state, action: PayloadAction<CoinPayload>) => {
        state.coin = action.payload.coin
      }
    },
    initialized: {
      prepare: (coin: CoinType, time: TimeRange) => ({ payload: { coin, time } }),
      reducer: (state, action: PayloadAction<PriceChartType>) => {
        state.coin = action.payload.coin
        state.time = action.payload.time
      }
    },
    timeClicked: {
      prepare: (time: TimeRange) => ({ payload: { time } }),
      reducer: (state, action: PayloadAction<TimePayload>) => {
        state.time = action.payload.time
      }
    }
  }
})

export const { coinClicked, initialized, timeClicked } = priceChartSlice.actions

const { actions } = priceChartSlice
const priceChartReducer = priceChartSlice.reducer
export { actions, priceChartReducer }
