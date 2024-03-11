import { RootState } from 'data/rootReducer'

export const getCoinDisplayed = (state: RootState) => state.preferences.coinDisplayed
export const getLanguage = (state: RootState) => state.preferences.language
export const getBSCheckoutPreferences = (state: RootState) => state.preferences.sbCheckout
export const getShowAirdropClaimModal = (state: RootState) =>
  state.preferences.showAirdropClaimModal
export const getShowInterestInfoBox = (state: RootState) => state.preferences.showInterestInfoBox
export const getShowKycCompleted = (state: RootState) => state.preferences.showKycCompleted
export const getShowKycGetStarted = (state: RootState) => state.preferences.showKycGetStarted
export const getShowSwapBanner = (state: RootState) => state.preferences.showSwapBanner
export const getShowSwapUpgrade = (state: RootState) => state.preferences.showSwapUpgradeModal
export const getShowUpgradeForAirdropModal = (state: RootState) =>
  state.preferences.showUpgradeForAirdropModal
export const getShowUpgradeForStxAirdropModal = (state: RootState) =>
  state.preferences.showUpgradeForStxAirdropModal
export const getTheme = (state: RootState) => state.preferences.theme
export const getTotalBalancesDropdown = (state: RootState) =>
  state.preferences.totalBalancesDropdown
