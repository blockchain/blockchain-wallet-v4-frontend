import { lift } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.core.settings.getEmail, selectors.core.settings.getEmailVerified],
  (emailR, emailVerifiedR) => {
    return lift((email, emailVerified) => ({ email, emailVerified }))(
      emailR,
      emailVerifiedR
    )
  }
)
