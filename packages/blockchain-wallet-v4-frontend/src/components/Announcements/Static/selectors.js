import { lift, equals } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { KYC_STATES } from 'data/modules/profile/model'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getEmail,
    selectors.core.settings.getEmailVerified,
    selectors.modules.profile.getUserKYCState,
    selectors.modules.profile.getSunriverTag
  ],
  (emailR, emailVerifiedR, kycStateR, sunriverTagR) => {
    return lift((email, emailVerified, kycState, sunriverTag) => {
      let announcementToShow
      if (sunriverTag && equals(kycState, KYC_STATES.NONE)) {
        announcementToShow = 'sunRiverKyc'
      } else if (!emailVerified) {
        announcementToShow = 'email'
      }
      return { email, announcementToShow }
    })(emailR, emailVerifiedR, kycStateR, sunriverTagR)
  }
)
