import { lift } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/misc'

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
