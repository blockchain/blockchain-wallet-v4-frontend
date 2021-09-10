import { createSlice } from '@reduxjs/toolkit'

import Remote from 'blockchain-wallet-v4/src/remote/remote'

import { SettingsState } from './types'

const initialState: SettingsState = {
  productsEligibility: Remote.NotAsked
}

const settingsSlice = createSlice({
  initialState,
  name: 'settings',
  reducers: {
    fetchProductsEligibility: () => {},
    fetchProductsEligibilityFailure: (state: SettingsState, action) => {
      state.productsEligibility = Remote.Failure(action.payload)
    },
    fetchProductsEligibilityLoading: (state: SettingsState) => {
      state.productsEligibility = Remote.Loading
    },
    fetchProductsEligibilitySuccess: (state: SettingsState, action) => {
      state.productsEligibility = Remote.Success(action.payload)
    },
    notificationsInitialized: () => {}
  }
})

export const {
  fetchProductsEligibility,
  fetchProductsEligibilityFailure,
  fetchProductsEligibilityLoading,
  fetchProductsEligibilitySuccess,
  notificationsInitialized
} = settingsSlice.actions

const { actions } = settingsSlice
const settingsReducer = settingsSlice.reducer
export { actions, settingsReducer }
