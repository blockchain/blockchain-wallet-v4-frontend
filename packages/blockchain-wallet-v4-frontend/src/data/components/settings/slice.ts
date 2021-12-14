import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'

import { LimitsAndDetails, SettingsState } from './types'

const initialState: SettingsState = {
  limitsAndDetails: Remote.NotAsked
}

const settingsSlice = createSlice({
  initialState,
  name: 'settings',
  reducers: {
    fetchLimitsAndDetails: () => {},
    fetchLimitsAndDetailsFailure: (state: SettingsState, action: PayloadAction<string>) => {
      state.limitsAndDetails = Remote.Failure(action.payload)
    },
    fetchLimitsAndDetailsLoading: (state: SettingsState) => {
      state.limitsAndDetails = Remote.Loading
    },
    fetchLimitsAndDetailsSuccess: (
      state: SettingsState,
      action: PayloadAction<LimitsAndDetails>
    ) => {
      state.limitsAndDetails = Remote.Success(action.payload)
    },
    notificationsInitialized: () => {}
  }
})

const { actions } = settingsSlice
const settingsReducer = settingsSlice.reducer
export { actions, settingsReducer }
