import { path } from 'ramda'
import { RootState } from 'data/rootReducer'

export const getCulture = path(['preferences', 'culture'])
export const getLanguage = (state: RootState) => state.preferences.language
export const getTheme = path(['preferences', 'theme'])
export const getCoinDisplayed = path(['preferences', 'coinDisplayed'])
export const getShowKycCompleted = path(['preferences', 'showKycCompleted'])
export const getPriceChart = path(['preferences', 'priceChart'])
export const getTotalBalancesDropdown = path([
  'preferences',
  'totalBalancesDropdown'
])
export const getSBFiatCurrency = (state: RootState) =>
  state.preferences.sbFiatCurrency
export const getShowKycGetStarted = path(['preferences', 'showKycGetStarted'])
export const getShowSwapBanner = path(['preferences', 'showSwapBanner'])
export const getShowSwapUpgrade = path(['preferences', 'showSwapUpgradeModal'])
export const getShowAirdropClaimModal = path([
  'preferences',
  'showAirdropClaimModal'
])
export const getShowUpgradeForAirdropModal = path([
  'preferences',
  'showUpgradeForAirdropModal'
])
export const getShowUpgradeForStxAirdropModal = path([
  'preferences',
  'showUpgradeForStxAirdropModal'
])
export const getShowLockboxSoftwareDownload = path([
  'preferences',
  'showLockboxSoftwareDownload'
])
