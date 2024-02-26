import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { BSOrderActionType } from '@core/types'
import { BSFixType } from 'data/types'

import { PreferencesState } from './types'

const initialState: PreferencesState = {
  coinDisplayed: true,
  language: 'en',
  sbCheckout: {
    BUY: {
      fix: 'FIAT'
    },
    SELL: {
      fix: 'CRYPTO'
    }
  },
  showAirdropClaimModal: true,
  showBackupReminder: true,
  showInterestInfoBox: true,
  showKycCompleted: true,
  showKycGetStarted: true,
  showSwapBanner: true,
  showSwapUpgradeModal: true,
  showUpgradeForAirdropModal: false,
  showUpgradeForStxAirdropModal: true,
  theme: 'default',
  totalBalancesDropdown: {
    pending: false,
    wallet: true
  }
}

const preferencesSlice = createSlice({
  initialState,
  name: 'preferences',
  reducers: {
    hideAirdropClaimModal: (state) => {
      state.showAirdropClaimModal = false
    },
    hideInterestInfoBox: (state) => {
      state.showInterestInfoBox = false
    },
    hideKycCompleted: (state) => {
      state.showKycCompleted = false
    },
    hideKycGetStarted: (state) => {
      state.showKycGetStarted = false
    },
    hideSwapBanner: (state) => {
      state.showSwapBanner = false
    },
    hideSwapUpgradeModal: (state) => {
      state.showSwapUpgradeModal = false
    },
    hideUpgradeForAirdropModal: (state) => {
      state.showUpgradeForStxAirdropModal = false
    },
    setBSCheckoutFix: (
      state,
      action: PayloadAction<{ fix: BSFixType; orderType: BSOrderActionType }>
    ) => {
      state.sbCheckout[action.payload.orderType].fix = action.payload.fix
    },
    setLanguage: (state, action: PayloadAction<{ language: string; showAlert: boolean }>) => {
      state.language = action.payload.language
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setTotalBalancesDropdown: (
      state,
      action: PayloadAction<{ key: 'pending' | 'wallet'; val: boolean }>
    ) => {
      state.totalBalancesDropdown[action.payload.key] = action.payload.val
    },
    toggleCoinDisplayed: (state) => {
      state.coinDisplayed = !state.coinDisplayed
    }
  }
})

export const { actions } = preferencesSlice
export const preferencesReducer = preferencesSlice.reducer
