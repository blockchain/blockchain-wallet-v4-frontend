import { path } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => ({
  email: selectors.core.settings.getEmail(state).getOrElse(undefined),
  signupError: path(['coinify', 'signupError'], state)
})
