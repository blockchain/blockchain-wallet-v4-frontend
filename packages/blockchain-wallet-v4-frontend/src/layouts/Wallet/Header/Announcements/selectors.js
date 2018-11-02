import { lift, equals, path, prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { KYC_STATES, USER_ACTIVATION_STATES } from 'data/modules/profile/model'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getEmail,
    selectors.core.settings.getEmailVerified,
    selectors.modules.profile.getUserData
  ],
  (emailR, emailVerifiedR, userDataR) => {
    return lift((email, emailVerified, userData) => {
      debugger
      const kycState = prop('kycState', userData)
      debugger
      const needsSunRiverKyc =
        path(['tags', 'SUNRIVER'], userData) &&
        (!equals(kycState, KYC_STATES.VERIFIED) ||
          !equals(kycState, KYC_STATES.PENDING))
      debugger
      return { email, announcement: emailVerified ? needsSunRiverKyc : 'email' }
    })(emailR, emailVerifiedR, userDataR)
  }
)
