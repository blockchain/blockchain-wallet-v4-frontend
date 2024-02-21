import { BSOrderActionType } from '@core/types'
import { BSFixType } from 'data/types'

// State
export type PreferencesState = {
  coinDisplayed: boolean
  language: string
  sbCheckout: {
    [key in BSOrderActionType]: {
      fix: BSFixType
    }
  }
  showAirdropClaimModal: boolean
  showBackupReminder: boolean
  showInterestInfoBox: boolean
  showKycCompleted: boolean
  showKycGetStarted: boolean
  showSwapBanner: boolean
  showSwapUpgradeModal: boolean
  showUpgradeForAirdropModal: boolean
  showUpgradeForStxAirdropModal: boolean
  theme: string
  totalBalancesDropdown: {
    pending: boolean
    wallet: boolean
  }
}
