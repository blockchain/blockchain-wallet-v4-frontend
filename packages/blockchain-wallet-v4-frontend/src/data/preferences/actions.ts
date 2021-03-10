import { SBOrderActionType } from 'blockchain-wallet-v4/src/types'
import { SBFixType } from 'data/components/types'

import * as AT from './actionTypes'

export const setCulture = culture => ({
  type: AT.SET_CULTURE,
  payload: { culture }
})
export const setLanguage = (language, showAlert) => ({
  type: AT.SET_LANGUAGE,
  payload: { language, showAlert }
})
export const toggleCoinDisplayed = () => ({ type: AT.TOGGLE_COIN_DISPLAY })

export const setSBCheckoutFix = (
  orderType: SBOrderActionType,
  fix: SBFixType
) => ({
  type: AT.SET_SB_CHECKOUT_FIX,
  payload: {
    orderType,
    fix
  }
})
export const setTheme = theme => ({ type: AT.SET_THEME, payload: { theme } })
export const setTotalBalancesDropdown = payload => ({
  type: AT.SET_TOTAL_BALANCES_DROPDOWN,
  payload
})

export const hideKycCompleted = () => ({ type: AT.HIDE_KYC_COMPLETED })
export const hideKycGetStarted = () => ({ type: AT.HIDE_KYC_GET_STARTED })
export const hideSwapBanner = () => ({ type: AT.HIDE_SWAP_BANNER })
export const hideSwapUpgradeModal = () => ({ type: AT.HIDE_SWAP_UPGRADE_MODAL })
export const hideAirdropClaimModal = () => ({
  type: AT.HIDE_AIRDROP_CLAIM_MODAL
})
export const hideUpgradeForAirdropModal = () => ({
  type: AT.HIDE_UPGRADE_FOR_AIRDROP_MODAL
})
export const hideLockboxSoftwareDownload = () => ({
  type: AT.HIDE_LOCKBOX_SOFTWARE_DOWNLOAD
})
export const hideInterestInfoBox = () => ({
  type: AT.HIDE_INTEREST_INFO_BOX
})
