import { selectors } from 'data'
import { lift } from 'ramda'

// getData :: state -> Remote( [email, emailVerified ])
export const getData = state => {
  const email = selectors.core.settings.getEmail(state)
  const emailVerified = selectors.core.settings.getEmailVerified(state)
  const emailVerifiedFailed = selectors.core.settings.getEmailVerifiedFailed(state)
  const f = (e, v, f) => ({ email: e, verified: v, failed: f })

  return lift(f)(email, emailVerified, emailVerifiedFailed)
}
