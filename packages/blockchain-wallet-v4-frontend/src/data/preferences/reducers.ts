import { TimeRange } from 'blockchain-wallet-v4/src/types'

import { coinClicked, timeClicked } from '../components/priceChart/slice'
import * as AT from './actionTypes'
import { PreferencesActionTypes, PreferencesState } from './types'

const INITIAL_STATE: PreferencesState = {
  coinDisplayed: true,
  culture: 'en-GB',
  language: 'en',
  priceChart: {
    coin: 'BTC',
    time: TimeRange.MONTH
  },
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

export function preferencesReducer(
  state = INITIAL_STATE,
  action: PreferencesActionTypes
): PreferencesState {
  switch (action.type) {
    // @ts-ignore
    case AT.SET_LANGUAGE: {
      // @ts-ignore
      const { language } = action.payload
      return {
        ...state,
        language
      }
    }
    // @ts-ignore
    case AT.SET_CULTURE: {
      // @ts-ignore
      const { culture } = action.payload
      return {
        ...state,
        culture
      }
    }
    case AT.SET_SB_CHECKOUT_FIX: {
      return {
        ...state,
        sbCheckout: {
          ...state.sbCheckout,
          [action.payload.orderType]: {
            ...state.sbCheckout[action.payload.orderType],
            fix: action.payload.fix
          }
        }
      }
    }
    // @ts-ignore
    case AT.SET_THEME: {
      // @ts-ignore
      const { theme } = action.payload
      return {
        ...state,
        theme
      }
    }
    // @ts-ignore
    case AT.SET_TOTAL_BALANCES_DROPDOWN: {
      // @ts-ignore
      const { key, val } = action.payload
      return {
        ...state,
        totalBalancesDropdown: {
          ...state.totalBalancesDropdown,
          [key]: val
        }
      }
    }
    // @ts-ignore
    case AT.TOGGLE_COIN_DISPLAY: {
      return {
        ...state,
        coinDisplayed: !state.coinDisplayed
      }
    }
    // @ts-ignore
    case AT.HIDE_KYC_COMPLETED: {
      return {
        ...state,
        showKycCompleted: false
      }
    }
    // @ts-ignore
    case coinClicked.type: {
      // @ts-ignore

      const { coin } = action.payload
      return {
        ...state,
        priceChart: {
          ...state.priceChart,
          coin
        }
      }
    }
    // @ts-ignore
    case timeClicked.type: {
      // @ts-ignore
      const { time } = action.payload
      return {
        ...state,
        priceChart: {
          ...state.priceChart,
          time
        }
      }
    }
    // @ts-ignore
    case AT.HIDE_AIRDROP_CLAIM_MODAL: {
      // @ts-ignore
      return {
        ...state,
        showAirdropClaimModal: false
      }
    }
    // @ts-ignore
    case AT.HIDE_UPGRADE_FOR_AIRDROP_MODAL: {
      // @ts-ignore
      return {
        ...state,
        showUpgradeForStxAirdropModal: false
      }
    }
    // @ts-ignore
    case AT.HIDE_INTEREST_INFO_BOX: {
      // @ts-ignore
      return {
        ...state,
        showInterestInfoBox: false
      }
    }
    // @ts-ignore
    case AT.HIDE_KYC_GET_STARTED: {
      // @ts-ignore
      return {
        ...state,
        showKycGetStarted: false
      }
    }
    // @ts-ignore
    case AT.HIDE_SWAP_BANNER: {
      // @ts-ignore
      return {
        ...state,
        showSwapBanner: false
      }
    }
    // @ts-ignore
    case AT.HIDE_SWAP_UPGRADE_MODAL: {
      // @ts-ignore
      return {
        ...state,
        showSwapUpgradeModal: false
      }
    }
    default:
      return { ...state }
  }
}
