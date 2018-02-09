import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = state => {
  const authType = selectors.core.settings.getAuthType(state)
  // const googleAuthSecretUrl = selectors.core.settings.getGoogleAuthSecretUrl(state)

  const f = (a) => ({ authType: a })

  return lift(f)(authType)
}
