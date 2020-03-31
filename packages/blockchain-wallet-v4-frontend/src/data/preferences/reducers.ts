import * as AT from './actionTypes'
import * as priceChartActionTypes from '../components/priceChart/actionTypes'
import { assoc, assocPath } from 'ramda'
import { PreferencesState } from './types'

const INITIAL_STATE: PreferencesState = {
  language: 'en',
  culture: 'en-GB',
  theme: 'default',
  sbFiatCurrency: undefined,
  coinDisplayed: true,
  showKycCompleted: true,
  showBackupReminder: true,
  showKycGetStarted: true,
  showLockboxSoftwareDownload: true,
  showSwapBanner: true,
  showSwapUpgradeModal: true,
  showAirdropClaimModal: true,
  showUpgradeForStxAirdropModal: true,
  totalBalancesDropdown: {
    wallet: true,
    lockbox: false,
    pending: false,
    watchOnly: false
  }
}

export function preferencesReducer (
  state = INITIAL_STATE,
  action
): PreferencesState {
  switch (action.type) {
    case AT.SET_LANGUAGE: {
      const { language } = action.payload
      return assoc('language', language, state)
    }
    case AT.SET_CULTURE: {
      const { culture } = action.payload
      return assoc('culture', culture, state)
    }
    case AT.SET_THEME: {
      const { theme } = action.payload
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
      const { key, val } = action.payload
      return {
        ...state,
        totalBalancesDropdown: {
          ...state.totalBalancesDropdown,
          [key]: val
        }
      }
    }
    case AT.SET_SB_FIAT_CURRENCY: {
      const { currency } = action.payload
      return {
        ...state,
        sbFiatCurrency: currency
      }
    }
    case priceChartActionTypes.PRICE_CHART_COIN_CLICKED: {
      const { coin } = action.payload
      return assocPath(['priceChart', 'coin'], coin, state)
    }
    case priceChartActionTypes.PRICE_CHART_TIME_CLICKED: {
      const { time } = action.payload
      return assocPath(['priceChart', 'time'], time, state)
    }
    case AT.HIDE_AIRDROP_CLAIM_MODAL: {
      return assoc('showAirdropClaimModal', false, state)
    }
    case AT.HIDE_UPGRADE_FOR_AIRDROP_MODAL: {
      return assoc('showUpgradeForStxAirdropModal', false, state)
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
    default:
      return state
  }
}
