import { BSOrderActionType, CoinType, TimeRange } from '@core/types'
import { BSFixType } from 'data/types'

import * as AT from './actionTypes'

export type PriceChartPreferenceType = {
  coin?: CoinType
  time?: TimeRange
}

// State
export type PreferencesState = {
  coinDisplayed: boolean
  language: string
  priceChart: PriceChartPreferenceType
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

interface SetBSCheckoutFixActionType {
  payload: {
    fix: BSFixType
    orderType: BSOrderActionType
  }
  type: typeof AT.SET_BS_CHECKOUT_FIX
}

export type PreferencesActionTypes = SetBSCheckoutFixActionType
