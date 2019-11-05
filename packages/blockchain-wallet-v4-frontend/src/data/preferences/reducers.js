import * as AT from './actionTypes'
import * as priceChartActionTypes from '../components/priceChart/actionTypes'
import { assoc, assocPath } from 'ramda'

const INITIAL_STATE = {
  language: 'en',
  culture: 'en-GB',
  theme: 'default',
  coinDisplayed: true,
  showKycCompleted: true,
  showBackupReminder: true,
  showKycGetStarted: true,
  showLockboxSoftwareDownload: true,
  showSwapBanner: true,
  showSwapUpgradeModal: true,
  showAirdropClaimModal: true,
  showUpgradeForAirdropModal: true,
  showThePitPulse: true,
  totalBalancesDropdown: {
    wallet: true,
    lockbox: false,
    pending: false,
    watchOnly: false
  }
}

const preferences = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.SET_LANGUAGE: {
      const { language } = payload
      return assoc('language', language, state)
    }
    case AT.SET_CULTURE: {
      const { culture } = payload
      return assoc('culture', culture, state)
    }
    case AT.SET_THEME: {
      const { theme } = payload
      return assoc('theme', theme, state)
    }
    case AT.TOGGLE_COIN_DISPLAY: {
      return assoc('coinDisplayed', !state.coinDisplayed, state)
    }
    case AT.HIDE_KYC_COMPLETED: {
      return assoc('showKycCompleted', false, state)
    }
    case AT.HIDE_LOCKBOX_SOFTWARE_DOWNLOAD: {
      return assoc('showLockboxSoftwareDownload', false, state)
    }
    case AT.SET_TOTAL_BALANCES_DROPDOWN: {
      const { key, val } = payload
      return assocPath(['totalBalancesDropdown', key], val, state)
    }
    case priceChartActionTypes.PRICE_CHART_COIN_CLICKED: {
      const { coin } = payload
      return assocPath(['priceChart', 'coin'], coin, state)
    }
    case priceChartActionTypes.PRICE_CHART_TIME_CLICKED: {
      const { time } = payload
      return assocPath(['priceChart', 'time'], time, state)
    }
    case AT.HIDE_AIRDROP_CLAIM_MODAL: {
      return assoc('showAirdropClaimModal', false, state)
    }
    case AT.HIDE_UPGRADE_FOR_AIRDROP_MODAL: {
      return assoc('showUpgradeForAirdropModal', false, state)
    }
    case AT.HIDE_KYC_GET_STARTED: {
      return assoc('showKycGetStarted', false, state)
    }
    case AT.HIDE_SWAP_BANNER: {
      return assoc('showSwapBanner', false, state)
    }
    case AT.HIDE_SWAP_UPGRADE_MODAL: {
      return assoc('showSwapUpgradeModal', false, state)
    }
    case AT.HIDE_THE_PIT_PULSE: {
      return assoc('showThePitPulse', false, state)
    }
    default:
      return state
  }
}

export default preferences
