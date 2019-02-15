import { path } from 'ramda'
import { selectors } from 'data'

export const getData = state => ({
  email: selectors.core.settings.getEmail(state).getOrElse(undefined),
  emailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(0),
  signupError: path(['coinify', 'signupError'], state)
})
