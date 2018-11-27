import { lift, equals, path, prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { KYC_STATES } from 'data/modules/profile/model'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getEmail,
    selectors.core.settings.getEmailVerified,
    selectors.modules.profile.getUserData
  ],
  (emailR, emailVerifiedR, userDataR) => {
    return lift((email, emailVerified, userData) => {
      let announcementToShow
      const kycState = prop('kycState', userData)
      if (
        path(['tags', 'SUNRIVER'], userData) &&
        equals(kycState, KYC_STATES.NONE)
      ) {
        announcementToShow = 'sunRiverKyc'
      } else if (!emailVerified) {
        announcementToShow = 'email'
      }
      return { email, announcementToShow }
    })(emailR, emailVerifiedR, userDataR)
  }
)
