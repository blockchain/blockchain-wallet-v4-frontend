import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'
import { CrossBorderLimitsPyload } from '@core/types'
import { SeamlessLimits } from 'data/types'

import {
  SwapAccountType,
  SwapActionTypes,
  SwapCheckoutFixType,
  SwapState,
  SwapStepPayload
} from './types'

const initialState: SwapState = {
  crossBorderLimits: Remote.NotAsked,
  custodialEligibility: Remote.NotAsked,
  fix: 'FIAT',
  limits: Remote.NotAsked,
  order: undefined,
  pairs: Remote.NotAsked,
  payment: Remote.NotAsked,
  quote: Remote.NotAsked,
  side: 'BASE',
  step: 'INIT_SWAP',
  trades: {
    list: [],
    status: Remote.NotAsked
  }
}

const sendCryptoSlice = createSlice({
  initialState,
  name: 'swap',
  reducers: {
    cancelOrder: (state, action: PayloadAction<{ id: string }>) => {},
    changeBase: (state, action: PayloadAction<{ account: SwapAccountType }>) => {},
    changeCounter: (state, action: PayloadAction<{ account: SwapAccountType }>) => {},
    // cross border limits
    fetchCrossBorderLimits: (state, action: PayloadAction<CrossBorderLimitsPyload>) => {},
    fetchCrossBorderLimitsFailure: (state, action: PayloadAction<string>) => {
      state.crossBorderLimits = Remote.Failure(action.payload)
    },
    fetchCrossBorderLimitsLoading: (state) => {
      state.crossBorderLimits = Remote.Loading
    },
    fetchCrossBorderLimitsSuccess: (state, action: PayloadAction<SeamlessLimits>) => {
      state.crossBorderLimits = Remote.Success(action.payload)
    }
  }
})

const { actions, reducer } = sendCryptoSlice
export { actions, reducer }
