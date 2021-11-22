import { TIER_TYPES } from 'blockchain-wallet-v4-frontend/src/modals/Settings/TradingLimits/model'
import { anyPass, equals } from 'ramda'

import { BSOrderType, SwapUserLimitsType } from '@core/types'
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
  | 'coinRename'
  | 'celoEURRewards'
  | 'servicePriceUnavailable'
  | null

export const getNewCoinAnnouncement = (coin: string) => `${coin}-homepage`
export const getCoinRenameAnnouncement = (coin: string) => `${coin}-rename`

const showBanner = (flag: boolean, banner: string, announcementState) => {
  return (
    flag &&
    (!announcementState ||
      !announcementState[banner] ||
      (announcementState[banner] && !announcementState[banner].dismissed))
  )
}

export const getData = (state: RootState): { bannerToShow: BannerType } => {
  const announcementState = selectors.cache.getLastAnnouncementState(state)
  // @ts-ignore
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)
  const ordersR = selectors.components.buySell.getBSOrders(state)
  const orders: Array<BSOrderType> = ordersR.getOrElse([])
  const isBuySellOrderPending = orders.find(
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
  const sddEligibleTier = selectors.components.buySell.getUserSddEligibleTier(state).getOrElse(1)

  // continueToGold
  const limits = selectors.components.buySell.getLimits(state).getOrElse({
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
  const isNewCurrency = showBanner(!!newCoinListing, newCoinAnnouncement, announcementState)

  // coinRename
  const coinRename = selectors.core.walletOptions.getCoinRename(state).getOrElse('')
  const coinRenameAnnouncement = getCoinRenameAnnouncement(coinRename)
  const showRenameBanner = showBanner(!!coinRename, coinRenameAnnouncement, announcementState)

  // cEUR Rewards
  const cEURAnnouncement = selectors.core.walletOptions
    .getCeloEurRewards(state)
    .getOrElse(false) as boolean
  const cEURAnnouncementAnnouncement = 'ceur-rewards'
  const showCEURBanner =
    showBanner(cEURAnnouncement, cEURAnnouncementAnnouncement, announcementState) &&
    userData &&
    userData.tiers?.current >= 1 &&
    userData.address &&
    userData.address.country &&
    ['US', 'IT'].indexOf(userData.address.country) === -1

  const isTier3SDD = sddEligibleTier === 3

  // servicePriceUnavailable
  const isServicePriceUnavailable = selectors.core.data.coins.getIsServicePriceDown(state)

  let bannerToShow: BannerType = null
  if (showDocResubmitBanner && !isKycPendingOrVerified) {
    bannerToShow = 'resubmit'
  } else if (isServicePriceUnavailable) {
    bannerToShow = 'servicePriceUnavailable'
  } else if (isBuySellOrderPending && !isTier3SDD) {
    bannerToShow = 'sbOrder'
  } else if (showCEURBanner) {
    bannerToShow = 'celoEURRewards'
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
  } else if (showRenameBanner) {
    bannerToShow = 'coinRename'
  } else if (isRecurringBuy) {
    bannerToShow = 'recurringBuys'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow
  }
}
