import { anyPass, equals, head, filter, propEq } from 'ramda'

import { selectors, model } from 'data'

const { KYC_STATES, TIERS_STATES } = model.profile
const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS

export const getData = state => {
  const kycNotFinished = selectors.modules.profile
    .getUserKYCState(state)
    .map(equals(KYC_STATES.NONE))
    .getOrElse(false)
  const showAirdropReminderBanner = selectors.modules.profile
    .getTiers(state)
    .map(filter(propEq('index', 2)))
    .map(head)
    .map(propEq('state', TIERS_STATES.NONE))
    .getOrElse(false)
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)
  const isTier2Verified = selectors.modules.profile
    .getTiers(state)
    .map(filter(propEq('index', 2)))
    .map(propEq('state', TIERS_STATES.VERIFIED))
    .getOrElse(false)
  const isSunRiverTagged = selectors.modules.profile
    .getSunRiverTag(state)
    .getOrElse(false)
  const showKycGetStarted = selectors.preferences.getShowKycGetStarted(state)
  const showSwapBannerPrefs = selectors.preferences.getShowSwapBanner(state)
  const showSwapBanner = !showKycGetStarted && showSwapBannerPrefs
  const showAirdropClaimBanner = !isSunRiverTagged && isTier2Verified

  let bannerToShow
  if (showDocResubmitBanner) {
    bannerToShow = 'resubmit'
  } else if (showAirdropClaimBanner) {
    bannerToShow = 'airdropClaim'
  } else if (showAirdropReminderBanner) {
    bannerToShow = 'airdropReminder'
  } else if (showSwapBanner) {
    bannerToShow = 'swap'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow,
    kycNotFinished,
    isSunRiverTagged
  }
}
