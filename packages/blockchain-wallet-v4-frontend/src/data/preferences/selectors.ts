import { path } from 'ramda'

import { TimeRange } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

export const getCoinDisplayed = (state: RootState) => state.preferences.coinDisplayed
export const getCulture = (state: RootState) => state.preferences.culture
export const getLanguage = (state: RootState) => state.preferences.language
export const getPriceChart = (state: RootState) => {
  // 🆕 Migrate old time ranges
  // 1day, 1week, 1month, 1year => day, week, month, year
  if (
    state.preferences.priceChart &&
    state.preferences.priceChart.time &&
    state.preferences.priceChart.time.includes('1')
  ) {
    return {
      ...state.preferences.priceChart,
      time: state.preferences.priceChart.time.split('1')[1] as TimeRange
    }
  }
  return state.preferences.priceChart
}
export const getSBCheckoutPreferences = (state: RootState) => state.preferences.sbCheckout
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
export const getTheme = (state: RootState) => path(['preferences', 'theme'], state)
export const getTotalBalancesDropdown = (state: RootState) =>
  state.preferences.totalBalancesDropdown
