import { TIER_TYPES } from 'blockchain-wallet-v4-frontend/src/modals/Settings/TradingLimits/model'
import { anyPass, equals } from 'ramda'

import { SBOrderType, SwapUserLimitsType } from 'blockchain-wallet-v4/src/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

const { EXPIRED, GENERAL } = model.profile.DOC_RESUBMISSION_REASONS
export type BannerType =
  | 'resubmit'
  | 'sbOrder'
  | 'finishKyc'
  | 'newCurrency'
  | 'buyCrypto'
  | 'continueToGold'
  | 'recurringBuys'
  | 'coinListing'
  | null

export const getNewCoinAnnouncement = (coin: string) => `${coin}-homepage`

export const getData = (state: RootState): { bannerToShow: BannerType } => {
  const announcementState = selectors.cache.getLastAnnouncementState(state)
  // @ts-ignore
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)
  const ordersR = selectors.components.simpleBuy.getSBOrders(state)
  const orders: Array<SBOrderType> = ordersR.getOrElse([])
  const isSimpleBuyOrderPending = orders.find(
    (order) => order.state === 'PENDING_CONFIRMATION' || order.state === 'PENDING_DEPOSIT'
  )

  const isUserActive =
    selectors.modules.profile.getUserActivationState(state).getOrElse('') !== 'NONE'
  const isKycStateNone =
    // @ts-ignore
    selectors.modules.profile.getUserKYCState(state).getOrElse('') === 'NONE'

  const isFirstLogin = selectors.auth.getFirstLogin(state)

  const userDataR = selectors.modules.profile.getUserData(state)
  const userData = userDataR.getOrElse({
    tiers: { current: 0 }
  } as UserDataType)

  const { KYC_STATES } = model.profile
  const isKycPendingOrVerified =
    userData.kycState === KYC_STATES.PENDING ||
    userData.kycState === KYC_STATES.UNDER_REVIEW ||
    userData.kycState === KYC_STATES.VERIFIED
  const sddEligibleTier = selectors.components.simpleBuy.getUserSddEligibleTier(state).getOrElse(1)

  // continueToGold
  const limits = selectors.components.simpleBuy.getLimits(state).getOrElse({
    annual: {
      available: '0'
    }
  } as SwapUserLimitsType)

  // recurringBuys
  const isRecurringBuy = selectors.core.walletOptions
    .getFeatureFlagRecurringBuys(state)
    .getOrElse(false) as boolean

  // newCurrency
  const newCoinListing = selectors.core.walletOptions.getNewCoinListing(state).getOrElse('')
  const newCoinAnnouncement = getNewCoinAnnouncement(newCoinListing)
  const isNewCurrency =
    newCoinListing &&
    (!announcementState ||
      !announcementState[newCoinAnnouncement] ||
      (announcementState[newCoinAnnouncement] && !announcementState[newCoinAnnouncement].dismissed))

  const isTier3SDD = sddEligibleTier === 3

  let bannerToShow: BannerType = null
  if (showDocResubmitBanner && !isKycPendingOrVerified) {
    bannerToShow = 'resubmit'
  } else if (isSimpleBuyOrderPending && !isTier3SDD) {
    bannerToShow = 'sbOrder'
  } else if (isKycStateNone && isUserActive && !isFirstLogin && !isTier3SDD) {
    bannerToShow = 'finishKyc'
  } else if (userData?.tiers?.current < 2 || isKycStateNone) {
    bannerToShow = 'buyCrypto'
  } else if (
    (userData?.tiers?.current === TIER_TYPES.SILVER ||
      userData?.tiers?.current === TIER_TYPES.SILVER_PLUS) &&
    limits?.max &&
    Number(limits?.max) > 0
  ) {
    bannerToShow = 'continueToGold'
  } else if (isNewCurrency) {
    bannerToShow = 'newCurrency'
  } else if (isRecurringBuy) {
    bannerToShow = 'recurringBuys'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow
  }
}
