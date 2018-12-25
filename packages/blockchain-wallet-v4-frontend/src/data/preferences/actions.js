import * as AT from './actionTypes'

export const setCulture = culture => ({
  type: AT.SET_CULTURE,
  payload: { culture }
})
export const setLanguage = (language, showAlert) => ({
  type: AT.SET_LANGUAGE,
  payload: { language, showAlert }
})
export const setTheme = theme => ({ type: AT.SET_THEME, payload: { theme } })
export const toggleCoinDisplayed = () => ({ type: AT.TOGGLE_COIN_DISPLAY })
export const hideKycCompleted = () => ({ type: AT.HIDE_KYC_COMPLETED })
export const setCoinShowIntro = (coin, displayed) => ({
  type: AT.SET_COIN_SHOW_INTRO,
  payload: { coin, displayed }
})
export const setTotalBalancesDropdown = payload => ({
  type: AT.SET_TOTAL_BALANCES_DROPDOWN,
  payload
})

export const hideKycGetStarted = () => ({ type: AT.HIDE_KYC_GET_STARTED })
export const hideSwapBanner = () => ({ type: AT.HIDE_SWAP_BANNER })
export const hideSwapUpgradeModal = () => ({ type: AT.HIDE_SWAP_UPGRADE_MODAL })
