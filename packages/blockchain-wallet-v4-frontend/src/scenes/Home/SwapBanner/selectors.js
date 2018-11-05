import { selectors } from 'data'
import { KYC_STATES } from 'data/modules/profile/model'

export const getData = (state) => {
  const showKycGetStarted = selectors.preferences.getShowKycGetStarted(state)
  const kycState = selectors.modules.profile.getUserKYCState(state).getOrElse(null)

  return {
    showBanner: !showKycGetStarted && kycState !== KYC_STATES.VERIFIED
  }
}
