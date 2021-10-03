import { lift } from 'ramda'

import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.core.settings.getEmail, selectors.core.settings.getEmailVerified],
  (emailR, emailVerifiedR) => {
    return lift((email, emailVerified) => {
      let announcementToShow
      if (!emailVerified) {
        announcementToShow = 'email'
      }
      return { email, announcementToShow }
    })(emailR, emailVerifiedR)
  }
)
