import { anyPass, equals } from 'ramda'

import { selectors, model } from 'data'

const { NONE } = model.profile.KYC_STATES
const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS

export const getData = state => {
  const kycNotFinished = selectors.modules.profile
    .getUserKYCState(state)
    .map(equals(NONE))
    .getOrElse(false)
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)
  const showKycGetStarted = selectors.preferences.getShowKycGetStarted(state)
  const showSwapBannerPrefs = selectors.preferences.getShowSwapBanner(state)
  const showSwapBanner = !showKycGetStarted && showSwapBannerPrefs

  return {
    bannerToShow: showDocResubmitBanner
      ? 'resubmit'
      : showSwapBanner
        ? 'swap'
        : null,
    kycNotFinished
  }
}
