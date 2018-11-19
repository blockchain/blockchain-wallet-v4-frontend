import { equals } from 'ramda'

import { selectors, model } from 'data'

const { NONE } = model.profile.KYC_STATES

export const getData = state => {
  const showKycGetStarted = selectors.preferences.getShowKycGetStarted(state)
  const showSwapBanner = selectors.preferences.getShowSwapBanner(state)
  const kycNotFinished = selectors.modules.profile
    .getUserKYCState(state)
    .map(equals(NONE))
    .getOrElse(false)

  return {
    kycNotFinished,
    showBanner: !showKycGetStarted && showSwapBanner
  }
}
