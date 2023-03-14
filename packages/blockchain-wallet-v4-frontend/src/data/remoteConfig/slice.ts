import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_CONFIG } from './constants'
import { RemoteConfig } from './types'

const initialState = DEFAULT_CONFIG

const remoteConfigSlice = createSlice({
  initialState,
  name: 'remoteConfig',
  reducers: {
    initialize: () => {},
    setConfig: (state, action: PayloadAction<RemoteConfig>) => {
      return action.payload
    }
  }
})

const initialize = createAction(`${remoteConfigSlice.name}/initialize`)
const initializeFailed = createAction(`${remoteConfigSlice.name}/initializeFailed`)
const actions = {
  ...remoteConfigSlice.actions,
  initialize,
  initializeFailed
}

const remoteConfigReducer = remoteConfigSlice.reducer

export { actions, remoteConfigReducer }
