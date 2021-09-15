import { CoinType, SBOrderActionType, TimeRange } from 'blockchain-wallet-v4/src/types'
import { SBFixType } from 'data/components/types'

import * as AT from './actionTypes'

export type PriceChartPreferenceType = {
  coin?: CoinType
  time?: TimeRange
}

// State
export type PreferencesState = {
  coinDisplayed: boolean
  culture: string
  language: string
  priceChart: PriceChartPreferenceType
  sbCheckout: {
    [key in SBOrderActionType]: {
      fix: SBFixType
    }
  }
  showAirdropClaimModal: boolean
  showBackupReminder: boolean
  showInterestInfoBox: boolean
  showKycCompleted: boolean
  showKycGetStarted: boolean
  showLockboxSoftwareDownload: boolean
  showSwapBanner: boolean
  showSwapUpgradeModal: boolean
  showUpgradeForAirdropModal: boolean
  showUpgradeForStxAirdropModal: boolean
  theme: string
  totalBalancesDropdown: {
    lockbox: boolean
    pending: boolean
    wallet: boolean
  }
}

interface SetSBCheckoutFixActionType {
  payload: {
    fix: SBFixType
    orderType: SBOrderActionType
  }
  type: typeof AT.SET_SB_CHECKOUT_FIX
}

export type PreferencesActionTypes = SetSBCheckoutFixActionType
