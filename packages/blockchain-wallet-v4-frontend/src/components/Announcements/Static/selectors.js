import { createDeepEqualSelector } from 'services/ReselectHelper'
import { equals, lift } from 'ramda'
import { KYC_STATES } from 'data/modules/profile/model'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getEmail,
    selectors.core.settings.getEmailVerified,
    selectors.modules.profile.getUserKYCState,
    selectors.modules.profile.getSunRiverTag
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
