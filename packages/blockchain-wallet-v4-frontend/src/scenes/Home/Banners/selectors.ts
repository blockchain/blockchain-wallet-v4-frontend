import { TIER_TYPES } from 'blockchain-wallet-v4-frontend/src/modals/Settings/TradingLimits/model'
import { anyPass, equals, isEmpty, lift } from 'ramda'

import {
  BSBalancesType,
  BSPaymentMethodsType,
  BSPaymentTypes,
  ExtractSuccess,
  FiatType,
  SwapUserLimitsType
} from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ProductEligibilityForUser, UserDataType } from 'data/types'

import ANNOUNCEMENTS from './constants'

const { DOC_RESUBMISSION_REASONS, KYC_STATES } = model.profile
const { EXPIRED, GENERAL } = DOC_RESUBMISSION_REASONS

type BannerType =
  | 'resubmit'
  | 'sbOrder'
  | 'finishKyc'
  | 'newCurrency'
  | 'buyCrypto'
  | 'continueToGold'
  | 'sanctions'
  | 'recurringBuys'
  | 'coinListing'
  | 'coinRename'
  | 'servicePriceUnavailable'
  | 'completeYourProfile'
  | 'taxCenter'
  | 'earnRewards'
  | 'appleAndGooglePay'
  | 'staking'
  | 'activeRewards'
  | null

const showBanner = (flag: boolean, banner: string, announcementState) => {
  return flag && !announcementState?.[banner]?.dismissed
}

export const getData = (state: RootState) => {
  const announcementState = selectors.cache.getLastAnnouncementState(state)

  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)

  const isUserActive =
    selectors.modules.profile.getUserActivationState(state).getOrElse('') !== 'NONE'
  const isKycStateNone = selectors.modules.profile.getUserKYCState(state).getOrElse('') === 'NONE'

  const showCompleteYourProfile = selectors.core.walletOptions
    .getCompleteYourProfile(state)
    .getOrElse(false) as boolean

  const showCompleteYourProfileBanner = showBanner(
    !!showCompleteYourProfile,
    ANNOUNCEMENTS.COMPLETE_PROFILE,
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

  const isKycPendingOrVerified = [
    KYC_STATES.PENDING,
    KYC_STATES.UNDER_REVIEW,
    KYC_STATES.VERIFIED
  ].includes(userData.kycState)

  const isKycRejected = userData.kycState === KYC_STATES.REJECTED

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

  const showRecurringBuyBanner = showBanner(
    isRecurringBuy,
    ANNOUNCEMENTS.RECURRING_BUY,
    announcementState
  )

  // newCurrency
  const newCoinListing = selectors.core.walletOptions.getNewCoinListing(state).getOrElse('')
  const newCoinAnnouncement = ANNOUNCEMENTS.NEW_COIN(newCoinListing)
  const isNewCurrency = showBanner(!!newCoinListing, newCoinAnnouncement, announcementState)

  // coinRename
  const coinRename = selectors.core.walletOptions.getCoinRename(state).getOrElse('')
  const coinRenameAnnouncement = ANNOUNCEMENTS.COIN_RENAME(coinRename)
  const showRenameBanner = showBanner(!!coinRename, coinRenameAnnouncement, announcementState)

  // servicePriceUnavailable
  const isServicePriceUnavailable = selectors.core.data.coins.getIsServicePriceDown(state)

  const showServicePriceUnavailableBanner = showBanner(
    !!isServicePriceUnavailable,
    ANNOUNCEMENTS.SERVICE_PRICE_UNAVAILABLE,
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

  const isBankOrCardLinked = cards?.length > 0 || isAnyBankLinked

  // user have some balance
  const balances = selectors.components.buySell.getBSBalances(state).getOrElse({} as BSBalancesType)
  const isBuyCrypto = Object.values(balances).some(
    (balance) => balance?.available && Number(balance?.available) > 0
  )

  // buy crypto
  const buyCryptoBannerCondition = userData?.tiers?.current !== 2 || isKycStateNone
  const showBuyCryptoBanner = showBanner(
    buyCryptoBannerCondition,
    ANNOUNCEMENTS.BUY_CRIPTO,
    announcementState
  )

  const isProfileCompleted = isKycPendingOrVerified && isBankOrCardLinked && isBuyCrypto

  // earnRewards
  const interestEligible = selectors.components.interest.getInterestEligible(state).getOrElse({})
  const isEarnRewardsPromoBannerFeatureFlagEnabled = selectors.core.walletOptions
    .getRewardsPromoBannerEnabled(state)
    .getOrElse(false) as boolean
  const isUserEligibleToEarnRewards = Object.values(interestEligible).some((obj) => !!obj?.eligible)
  const isEarnRewardsPromoBannerEnabled = !!(
    isEarnRewardsPromoBannerFeatureFlagEnabled && isUserEligibleToEarnRewards
  )

  const showEarnRewardsBanner = showBanner(
    isEarnRewardsPromoBannerEnabled,
    ANNOUNCEMENTS.EARN_REWARDS,
    announcementState
  )

  // Apple and Google Pay
  const isAppleAndGooglePayPromoBannerFeatureFlagEnabled = selectors.core.walletOptions
    .getAppleAndGooglePayPromoBannerEnabled(state)
    .getOrElse(false) as boolean

  const showAppleAndGooglePayBanner = showBanner(
    isAppleAndGooglePayPromoBannerFeatureFlagEnabled,
    ANNOUNCEMENTS.APPLE_GOOGLE_PAY,
    announcementState
  )

  // Staking
  const stakingEligible = selectors.components.interest.getStakingEligible(state).getOrElse({})

  const isUserStakingEligible = Object.values(stakingEligible).some((obj) => !!obj?.eligible)
  const isStakingPromoBannerFeatureFlagEnabled = selectors.core.walletOptions
    .getStakingPromoBannerEnabled(state)
    .getOrElse(false) as boolean

  const showStakingBanner = showBanner(
    isStakingPromoBannerFeatureFlagEnabled && isUserStakingEligible,
    ANNOUNCEMENTS.STAKING,
    announcementState
  )

  // active rewards
  const activeRewardsEligible = selectors.components.interest
    .getActiveRewardsEligible(state)
    .getOrElse({})
  const isUserActiveRewardsEligible =
    !isEmpty(activeRewardsEligible) &&
    Object.values(activeRewardsEligible).some((obj) => !!obj?.eligible)
  const isActiveRewardsPromoBannerFeatureFlagEnabled = selectors.core.walletOptions
    .getActiveRewardsPromoBannerEnabled(state)
    .getOrElse(false) as boolean

  const showActiveRewardsBanner = showBanner(
    isActiveRewardsPromoBannerFeatureFlagEnabled && isUserActiveRewardsEligible,
    ANNOUNCEMENTS.ACTIVE_REWARDS,
    announcementState
  )

  // Continue to Gold
  const continueToGold =
    [TIER_TYPES.SILVER, TIER_TYPES.SILVER_PLUS].includes(userData?.tiers?.current) &&
    Number(limits?.max) > 0

  const showContinueToGoldBanner = showBanner(
    !!continueToGold,
    ANNOUNCEMENTS.CONTINUE_TO_GOLD,
    announcementState
  )

  // KYC finish banner
  const showFinishKYC = isKycStateNone && isUserActive && !isFirstLogin
  const showKYCFinishBanner = showBanner(showFinishKYC, ANNOUNCEMENTS.KYC_FINISH, announcementState)

  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const activeRewardsEligibleR = selectors.components.interest.getActiveRewardsEligible(state)
  const fiatCurrencyR = selectors.core.settings.getCurrency(state)

  let bannerToShow: BannerType = null

  const isKycEnabled = products?.kycVerification?.enabled

  if (showSanctionsBanner) {
    bannerToShow = 'sanctions'
  } else if (
    showCompleteYourProfileBanner &&
    !isProfileCompleted &&
    userData?.tiers?.current !== TIER_TYPES.GOLD &&
    isUserDataLoaded &&
    isKycEnabled &&
    !isKycRejected
  ) {
    bannerToShow = 'completeYourProfile'
  } else if (showDocResubmitBanner && !isKycPendingOrVerified && isKycEnabled) {
    bannerToShow = 'resubmit'
  } else if (showActiveRewardsBanner && isKycEnabled) {
    bannerToShow = 'activeRewards'
  } else if (showStakingBanner && isKycEnabled) {
    bannerToShow = 'staking'
  } else if (showAppleAndGooglePayBanner && isKycEnabled) {
    bannerToShow = 'appleAndGooglePay'
  } else if (showServicePriceUnavailableBanner && isKycEnabled) {
    bannerToShow = 'servicePriceUnavailable'
  } else if (showKYCFinishBanner && isKycEnabled) {
    bannerToShow = 'finishKyc'
  } else if (showBuyCryptoBanner && isKycEnabled) {
    bannerToShow = 'buyCrypto'
  } else if (showContinueToGoldBanner && isKycEnabled) {
    bannerToShow = 'continueToGold'
  } else if (isNewCurrency) {
    bannerToShow = 'newCurrency' // Show even KYC is disabled
  } else if (showRenameBanner) {
    bannerToShow = 'coinRename' // Show even KYC is disabled
  } else if (showEarnRewardsBanner && isKycEnabled) {
    bannerToShow = 'earnRewards'
  } else if (showRecurringBuyBanner && isKycEnabled) {
    bannerToShow = 'recurringBuys'
  } else {
    bannerToShow = null
  }

  return lift(
    (
      activeRewardsEligible: ExtractSuccess<typeof activeRewardsEligibleR>,
      fiatCurrency: FiatType,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      activeRewardsEligible,
      bannerToShow,
      fiatCurrency,
      stakingEligible,
      userData
    })
  )(activeRewardsEligibleR, fiatCurrencyR, stakingEligibleR, userDataR)
}
