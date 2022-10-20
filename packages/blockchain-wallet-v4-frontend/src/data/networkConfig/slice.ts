import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'

import { NetworkConfig, NetworkConfigState } from './types'

const initialState: NetworkConfigState = {
  config: Remote.NotAsked
}

const networkConfigSlice = createSlice({
  initialState,
  name: 'networkConfig',
  reducers: {
    fetchNetworkConfig: () => {},
    fetchNetworkConfigFailure: (state) => {
      state.config = Remote.Failure(null)
    },
    fetchNetworkConfigLoading: (state) => {
      state.config = Remote.Loading
    },
    fetchNetworkConfigSuccess: (state, payload: PayloadAction<NetworkConfig>) => {
      state.config = Remote.of(payload.payload)
    }
  }
})

const { actions } = networkConfigSlice
const networkConfigReducer = networkConfigSlice.reducer

export { actions, networkConfigReducer }
