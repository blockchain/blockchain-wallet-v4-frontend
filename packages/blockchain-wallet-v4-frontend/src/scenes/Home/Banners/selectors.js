import { anyPass, equals } from 'ramda'

import { selectors, model } from 'data'

const { KYC_STATES } = model.profile
const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS

export const getData = state => {
  const kycNotFinished = selectors.modules.profile
    .getUserKYCState(state)
    .map(equals(KYC_STATES.NONE))
    .getOrElse(false)
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)
  const showKycGetStarted = selectors.preferences.getShowKycGetStarted(state)
  const showSwapBannerPrefs = selectors.preferences.getShowSwapBanner(state)
  const showSwapBanner = !showKycGetStarted && showSwapBannerPrefs

  let bannerToShow
  if (showDocResubmitBanner) {
    bannerToShow = 'resubmit'
  } else if (showSwapBanner) {
    bannerToShow = 'swap'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow,
    kycNotFinished
  }
}
