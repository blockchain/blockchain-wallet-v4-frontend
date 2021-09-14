import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CoinType, TimeRange } from 'blockchain-wallet-v4/src/types'

const initialState = {
  coin: 'BTC',
  time: TimeRange.ALL
}

type CoinPayload = {
  coin: CoinType
}

type InitializedPayload = {
  coin: CoinType
  time: TimeRange
}

type TimePayload = {
  time: TimeRange
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
      reducer: (state, action: PayloadAction<InitializedPayload>) => {
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
