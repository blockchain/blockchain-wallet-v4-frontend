import { path } from 'ramda'
import { RootState } from 'data/rootReducer'

export const getCoinDisplayed = (state: RootState) =>
  state.preferences.coinDisplayed
export const getCulture = (state: RootState) => state.preferences.culture
export const getLanguage = (state: RootState) => state.preferences.language
export const getPriceChart = (state: RootState) => state.preferences.priceChart
export const getSBCheckoutPreferences = (state: RootState) =>
  state.preferences.sbCheckout
export const getSBFiatCurrency = (state: RootState) =>
  state.preferences.sbFiatCurrency
export const getShowAirdropClaimModal = (state: RootState) =>
  state.preferences.showAirdropClaimModal
export const getShowInterestInfoBox = (state: RootState) =>
  state.preferences.showInterestInfoBox
export const getShowKycCompleted = (state: RootState) =>
  state.preferences.showKycCompleted
export const getShowKycGetStarted = (state: RootState) =>
  state.preferences.showKycGetStarted
export const getShowLockboxSoftwareDownload = (state: RootState) =>
  state.preferences.showLockboxSoftwareDownload
export const getShowSwapBanner = (state: RootState) =>
  state.preferences.showSwapBanner
export const getShowSwapUpgrade = (state: RootState) =>
  state.preferences.showSwapUpgradeModal
export const getShowUpgradeForAirdropModal = (state: RootState) =>
  state.preferences.showUpgradeForAirdropModal
export const getShowUpgradeForStxAirdropModal = (state: RootState) =>
  state.preferences.showUpgradeForStxAirdropModal
export const getTheme = (state: RootState) =>
  path(['preferences', 'theme'], state)
export const getTotalBalancesDropdown = (state: RootState) =>
  state.preferences.totalBalancesDropdown
