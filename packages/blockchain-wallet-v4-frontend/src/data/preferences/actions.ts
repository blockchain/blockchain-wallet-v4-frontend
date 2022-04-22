import { BSOrderActionType } from '@core/types'
import { BSFixType } from 'data/types'

import * as AT from './actionTypes'

export const setLanguage = (language, showAlert) => ({
  payload: { language, showAlert },
  type: AT.SET_LANGUAGE
})
export const toggleCoinDisplayed = () => ({ type: AT.TOGGLE_COIN_DISPLAY })

export const setBSCheckoutFix = (orderType: BSOrderActionType, fix: BSFixType) => ({
  payload: {
    fix,
    orderType
  },
  type: AT.SET_BS_CHECKOUT_FIX
})
export const setTheme = (theme) => ({ payload: { theme }, type: AT.SET_THEME })
export const setTotalBalancesDropdown = (payload) => ({
  payload,
  type: AT.SET_TOTAL_BALANCES_DROPDOWN
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
export const hideInterestInfoBox = () => ({
  type: AT.HIDE_INTEREST_INFO_BOX
})
export const setLinkHandling = () => ({
  type: AT.SET_LINK_HANDLING
})
