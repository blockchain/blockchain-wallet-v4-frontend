import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { Experiments } from '@core/network/api/experiments/types'

import { ExperimentsState } from './types'

const initialState: ExperimentsState = {
  data: Remote.NotAsked
}

const experimentsSlice = createSlice({
  initialState,
  name: 'experiments',
  reducers: {
    fetch: () => {},
    fetchFailure: (state: ExperimentsState, action: PayloadAction<string>) => {
      state.data = Remote.Failure(action.payload)
    },
    fetchLoading: (state: ExperimentsState) => {
      state.data = Remote.Loading
    },
    fetchSuccess: (state: ExperimentsState, action: PayloadAction<Experiments>) => {
      state.data = Remote.Success(action.payload)
    }
  }
})

export const { actions } = experimentsSlice
export const experimentsReducer = experimentsSlice.reducer
