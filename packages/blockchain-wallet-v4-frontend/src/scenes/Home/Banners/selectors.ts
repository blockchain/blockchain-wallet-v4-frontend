import { TIER_TYPES } from 'blockchain-wallet-v4-frontend/src/modals/Settings/TradingLimits/model'
import { anyPass, equals, isEmpty } from 'ramda'

import {
  BSBalancesType,
  BSPaymentMethodsType,
  BSPaymentTypes,
  SwapUserLimitsType
} from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ProductEligibilityForUser, UserDataType } from 'data/types'

const { EXPIRED, GENERAL } = model.profile.DOC_RESUBMISSION_REASONS
export type BannerType =
  | 'resubmit'
  | 'sbOrder'
  | 'finishKyc'
  | 'newCurrency'
  | 'buyCrypto'
  | 'continueToGold'
  | 'sanctions'
  | 'recurringBuys'
  | 'sanctions'
  | 'coinListing'
  | 'coinRename'
  | 'servicePriceUnavailable'
  | 'completeYourProfile'
  | 'taxCenter'
  | 'earnRewards'
  | null

export const getNewCoinAnnouncement = (coin: string) => `${coin}-homepage`
export const getCoinRenameAnnouncement = (coin: string) => `${coin}-rename`

export const getCompleteProfileAnnouncement = () => `complete-profile-homepage`
export const getSanctionsAnnouncement = () => `sanctions-homepage`
export const getBuyCryptoAnnouncement = () => `buy-crypto-homepage`
export const getRecurringBuyAnnouncement = () => `recurring-buys-homepage`
export const getEarnRewardsAnnouncement = () => `earn-rewards-homepage`
export const getServicePriceUnavailableAnnouncement = () => `service-price-unavailable-homepage`
export const getKYCFinishAnnouncement = () => `kyc-finish-homepage`
export const getContinueToGoldAnnouncement = () => `continue-to-gold-homepage`

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
  let isVerifiedId = false
  let isBankOrCardLinked = false
  let isBuyCrypto = false

  // @ts-ignore
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)

  const isUserActive =
    selectors.modules.profile.getUserActivationState(state).getOrElse('') !== 'NONE'
  const isKycStateNone =
    // @ts-ignore
    selectors.modules.profile.getUserKYCState(state).getOrElse('') === 'NONE'

  const showCompleteYourProfile = selectors.core.walletOptions
    .getCompleteYourProfile(state)
    .getOrElse(false) as boolean
  const completeProfileAnnouncement = getCompleteProfileAnnouncement()
  const showCompleteYourProfileBanner = showBanner(
    !!showCompleteYourProfile,
    completeProfileAnnouncement,
    announcementState
  )

  const userHadNotifications = selectors.custodial.getUserHadNotifications(state)
  const products = selectors.custodial.getProductEligibilityForUser(state).getOrElse({
    notifications: []
  } as ProductEligibilityForUser)

  const showSanctionsBanner = products?.notifications?.length > 0 || userHadNotifications

  const isFirstLogin = selectors.signup.getFirstLogin(state)

  const userDataR = selectors.modules.profile.getUserData(state)
  // use this to prevent rendering of complete profile banner
  const isUserDataLoaded = userDataR.cata({
    Failure: () => true,
    Loading: () => false,
    NotAsked: () => false,
    Success: () => true
  })
  const userData = userDataR.getOrElse({
    address: { country: '' },
    tags: {},
    tiers: { current: 0 }
  } as UserDataType)

  const { KYC_STATES } = model.profile
  const isKycPendingOrVerified =
    userData.kycState === KYC_STATES.PENDING ||
    userData.kycState === KYC_STATES.UNDER_REVIEW ||
    userData.kycState === KYC_STATES.VERIFIED
  const sddEligibleTier = selectors.components.buySell.getUserSddEligibleTier(state).getOrElse(1)

  if (isKycPendingOrVerified) {
    isVerifiedId = true
  }

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
  const recurringBuyAnnouncement = getRecurringBuyAnnouncement()
  const showRecurringBuyBanner = showBanner(
    isRecurringBuy,
    recurringBuyAnnouncement,
    announcementState
  )

  // newCurrency
  const newCoinListing = selectors.core.walletOptions.getNewCoinListing(state).getOrElse('')
  const newCoinAnnouncement = getNewCoinAnnouncement(newCoinListing)
  const isNewCurrency = showBanner(!!newCoinListing, newCoinAnnouncement, announcementState)

  // coinRename
  const coinRename = selectors.core.walletOptions.getCoinRename(state).getOrElse('')
  const coinRenameAnnouncement = getCoinRenameAnnouncement(coinRename)
  const showRenameBanner = showBanner(!!coinRename, coinRenameAnnouncement, announcementState)

  const isTier3SDD = sddEligibleTier === 3

  // servicePriceUnavailable
  const isServicePriceUnavailable = selectors.core.data.coins.getIsServicePriceDown(state)
  const servicePriceUnavailableAnnouncement = getServicePriceUnavailableAnnouncement()
  const showServicePriceUnavailableBanner = showBanner(
    !!isServicePriceUnavailable,
    servicePriceUnavailableAnnouncement,
    announcementState
  )

  const cards = selectors.components.buySell.getBSCards(state).getOrElse([])
  const paymentMethods = selectors.components.buySell
    .getBSPaymentMethods(state)
    .getOrElse({} as BSPaymentMethodsType)
  const isAnyBankLinked =
    paymentMethods?.methods?.length > 0 &&
    paymentMethods.methods.find(
      (method) => method.eligible && method.type === BSPaymentTypes.LINK_BANK
    )
  if (cards?.length > 0 || isAnyBankLinked) {
    isBankOrCardLinked = true
  }

  // user have some balance
  const balances = selectors.components.buySell.getBSBalances(state).getOrElse({} as BSBalancesType)
  if (!isEmpty(balances)) {
    if (
      Object.values(balances).some(
        (balance) => balance?.available && Number(balance?.available) > 0
      )
    ) {
      isBuyCrypto = true
    }
  }

  // buy crypto
  const buyCryptoAnnouncement = getBuyCryptoAnnouncement()
  const buyCryptoBannerCondition = userData?.tiers?.current < 2 || isKycStateNone
  const showBuyCryptoBanner = showBanner(
    buyCryptoBannerCondition,
    buyCryptoAnnouncement,
    announcementState
  )

  const isProfileCompleted = isVerifiedId && isBankOrCardLinked && isBuyCrypto

  // earnRewards
  const interestEligible = selectors.components.interest.getInterestEligible(state).getOrElse({})
  const isEarnRewardsPromoBannerFeatureFlagEnabled = selectors.core.walletOptions
    .getRewardsPromoBannerEnabled(state)
    .getOrElse(false) as boolean
  const isUserEligibleToEarnRewards =
    !isEmpty(interestEligible) && Object.values(interestEligible).some((obj) => !!obj?.eligible)
  const isEarnRewardsPromoBannerEnabled = !!(
    isEarnRewardsPromoBannerFeatureFlagEnabled && isUserEligibleToEarnRewards
  )
  const earnRewardsAnnouncement = getEarnRewardsAnnouncement()
  const showEarnRewardsBanner = showBanner(
    isEarnRewardsPromoBannerEnabled,
    earnRewardsAnnouncement,
    announcementState
  )

  // Continue to Gold
  const continueToGold =
    (userData?.tiers?.current === TIER_TYPES.SILVER ||
      userData?.tiers?.current === TIER_TYPES.SILVER_PLUS) &&
    limits?.max &&
    Number(limits?.max) > 0
  const continueToGoldAnnouncement = getContinueToGoldAnnouncement()
  const showContinueToGoldBanner = showBanner(
    !!continueToGold,
    continueToGoldAnnouncement,
    announcementState
  )

  // KYC finish banner
  const kycFinishAnnouncement = getKYCFinishAnnouncement()
  const showFinishKYC = isKycStateNone && isUserActive && !isFirstLogin && !isTier3SDD
  const showKYCFinishBanner = showBanner(showFinishKYC, kycFinishAnnouncement, announcementState)

  let bannerToShow: BannerType = null
  if (showSanctionsBanner) {
    bannerToShow = 'sanctions'
  } else if (
    showCompleteYourProfileBanner &&
    !isProfileCompleted &&
    userData?.tiers?.current !== TIER_TYPES.GOLD &&
    isUserDataLoaded
  ) {
    bannerToShow = 'completeYourProfile'
  } else if (showDocResubmitBanner && !isKycPendingOrVerified) {
    bannerToShow = 'resubmit'
  } else if (showServicePriceUnavailableBanner) {
    bannerToShow = 'servicePriceUnavailable'
  } else if (showKYCFinishBanner) {
    bannerToShow = 'finishKyc'
  } else if (showBuyCryptoBanner) {
    bannerToShow = 'buyCrypto'
  } else if (showContinueToGoldBanner) {
    bannerToShow = 'continueToGold'
  } else if (isNewCurrency) {
    bannerToShow = 'newCurrency'
  } else if (showRenameBanner) {
    bannerToShow = 'coinRename'
  } else if (showEarnRewardsBanner) {
    bannerToShow = 'earnRewards'
  } else if (showRecurringBuyBanner) {
    bannerToShow = 'recurringBuys'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow
  }
}
