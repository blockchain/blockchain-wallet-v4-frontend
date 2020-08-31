import * as AT from './actionTypes'

import { FiatType, SBOrderActionType } from 'core/types'
import { SBFixType } from 'data/components/types'

// State
export type PreferencesState = {
  coinDisplayed: boolean
  culture: string
  language: string
  priceChart: any
  sbCheckout: {
    [key in SBOrderActionType]: {
      fix: SBFixType
    }
  }
  sbFiatCurrency: undefined | FiatType
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
