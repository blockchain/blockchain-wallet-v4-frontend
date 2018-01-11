import { selectors } from 'data'
import { lift } from 'ramda'

// getData :: state -> Remote( [email, emailVerified ])
export const getData = state => {
  const email = selectors.core.settings.getEmail(state)
  const emailVerified = selectors.core.settings.getEmailVerified(state)
  const f = (e, v) => ({ email: e, verified: v })

  // return sequence(Remote.of, [email, emailVerified])
  return lift(f)(email, emailVerified)
}
